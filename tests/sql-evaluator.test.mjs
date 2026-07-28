import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const evaluatorPath = join(projectRoot, "tools", "sql_evaluator.py");

function evaluate(challengeId, code) {
  const result = spawnSync("python3", ["-I", "-S", evaluatorPath], {
    cwd: projectRoot,
    input: JSON.stringify({ challengeId, code }),
    encoding: "utf8",
    timeout: 3_000
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

const solutions = {
  "mysql-create-learners": `CREATE TABLE learners(id INTEGER PRIMARY KEY,name VARCHAR(50) NOT NULL,email VARCHAR(100) NOT NULL UNIQUE);`,
  "mysql-select-paid-orders": `SELECT id,amount FROM orders WHERE status='paid' AND amount>=80 ORDER BY amount DESC;`,
  "mysql-city-aggregation": `SELECT c.city,COUNT(*) AS order_count,SUM(o.amount) AS total_amount FROM customers c JOIN orders o ON o.customer_id=c.id WHERE o.status='paid' GROUP BY c.city ORDER BY total_amount DESC;`,
  "mysql-left-join-summary": `SELECT c.name,COUNT(o.id) AS order_count FROM customers c LEFT JOIN orders o ON o.customer_id=c.id GROUP BY c.id,c.name ORDER BY order_count DESC,c.id ASC;`,
  "mysql-order-constraints": `CREATE TABLE payments(id INTEGER PRIMARY KEY,order_id INTEGER NOT NULL REFERENCES orders(id),amount DECIMAL(10,2) NOT NULL CHECK(amount>0),status VARCHAR(20) NOT NULL CHECK(status IN ('pending','paid','failed')));`,
  "mysql-transfer-transaction": `BEGIN; UPDATE accounts SET balance=balance-100 WHERE id=1; UPDATE accounts SET balance=balance+100 WHERE id=2; COMMIT;`,
  "mysql-composite-index": `CREATE INDEX idx_orders_lookup ON orders(customer_id,status,created_at);`,
  "mysql-enrollment-design": `CREATE TABLE learners(id INTEGER PRIMARY KEY,name VARCHAR(50) NOT NULL); CREATE TABLE courses(id INTEGER PRIMARY KEY,name VARCHAR(100) NOT NULL); CREATE TABLE enrollments(id INTEGER PRIMARY KEY,learner_id INTEGER NOT NULL REFERENCES learners(id),course_id INTEGER NOT NULL REFERENCES courses(id),UNIQUE(learner_id,course_id));`
};

test("八个 MySQL 关卡的参考 SQL 全部通过隔离判题", () => {
  for (const [challengeId, code] of Object.entries(solutions)) {
    const result = evaluate(challengeId, code);
    assert.equal(result.ok, true, `${challengeId}: ${result.message}\n${JSON.stringify(result.results)}`);
  }
});

test("SQL 判题器返回可操作的失败结果并拒绝文件数据库", () => {
  const wrong = evaluate("mysql-select-paid-orders", "SELECT id,amount FROM orders");
  assert.equal(wrong.ok, false);
  assert.ok(wrong.results.some((item) => !item.passed));

  const unsafe = evaluate("mysql-select-paid-orders", "ATTACH DATABASE '/tmp/demo.db' AS demo");
  assert.equal(unsafe.ok, false);
  assert.match(unsafe.message, /禁止/);
});
