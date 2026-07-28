import json
import re
import sqlite3
import sys


BASE_SCHEMA = """
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL
);
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  status TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TEXT NOT NULL
);
INSERT INTO customers VALUES
  (1, '小码', '深圳'), (2, '小智', '广州'), (3, '小新', '深圳');
INSERT INTO orders VALUES
  (101, 1, 'paid', 120.00, '2026-07-01'),
  (102, 1, 'cancelled', 50.00, '2026-07-02'),
  (103, 2, 'paid', 80.00, '2026-07-02'),
  (104, 3, 'paid', 200.00, '2026-07-03'),
  (105, 3, 'paid', 30.00, '2026-07-03');
"""


def normalize(value):
    if isinstance(value, float) and value.is_integer():
        return int(value)
    return value


def rows(cursor):
    return [[normalize(value) for value in row] for row in cursor.fetchall()]


def query_case(connection, sql, expected, columns):
    cursor = connection.execute(sql)
    actual_columns = [item[0] for item in cursor.description or []]
    actual = rows(cursor)
    return [
        {
            "name": "结果列",
            "passed": [item.lower() for item in actual_columns] == [item.lower() for item in columns],
            "actual": actual_columns,
            "expected": columns,
        },
        {
            "name": "结果行（含顺序）",
            "passed": actual == expected,
            "actual": actual,
            "expected": expected,
        },
    ]


def table_info(connection, table):
    return connection.execute(f"PRAGMA table_info({table})").fetchall()


def evaluate(challenge_id, sql):
    if not isinstance(sql, str) or not sql.strip():
        return {"ok": False, "message": "请先填写 SQL"}
    if len(sql) > 10_000:
        return {"ok": False, "message": "SQL 超过 10,000 字符限制"}
    if re.search(r"\b(ATTACH|DETACH|VACUUM|PRAGMA|LOAD_EXTENSION)\b", sql, re.I):
        return {"ok": False, "message": "教学沙箱禁止文件数据库、PRAGMA 和扩展加载"}

    connection = sqlite3.connect(":memory:")
    connection.executescript("PRAGMA foreign_keys = ON;" + BASE_SCHEMA)
    results = []

    try:
        if challenge_id == "mysql-create-learners":
            connection.executescript(sql)
            info = table_info(connection, "learners")
            names = [row[1].lower() for row in info]
            primary = [row[1].lower() for row in info if row[5]]
            not_null = [row[1].lower() for row in info if row[3]]
            results = [
                {"name": "创建 learners 表", "passed": bool(info), "actual": names, "expected": ["id", "name", "email"]},
                {"name": "字段完整", "passed": names == ["id", "name", "email"], "actual": names, "expected": ["id", "name", "email"]},
                {"name": "id 是主键", "passed": primary == ["id"], "actual": primary, "expected": ["id"]},
                {"name": "name 与 email 非空", "passed": {"name", "email"}.issubset(not_null), "actual": not_null, "expected": ["name", "email"]},
            ]
            try:
                connection.execute("INSERT INTO learners(id,name,email) VALUES (1,'A','same@example.com'),(2,'B','same@example.com')")
                unique_ok = False
            except sqlite3.IntegrityError:
                unique_ok = True
            results.append({"name": "email 唯一约束", "passed": unique_ok, "actual": unique_ok, "expected": True})
        elif challenge_id == "mysql-select-paid-orders":
            results = query_case(
                connection, sql,
                [[104, 200], [101, 120], [103, 80]],
                ["id", "amount"],
            )
        elif challenge_id == "mysql-city-aggregation":
            results = query_case(
                connection, sql,
                [["深圳", 3, 350], ["广州", 1, 80]],
                ["city", "order_count", "total_amount"],
            )
        elif challenge_id == "mysql-left-join-summary":
            results = query_case(
                connection, sql,
                [["小码", 2], ["小新", 2], ["小智", 1]],
                ["name", "order_count"],
            )
        elif challenge_id == "mysql-order-constraints":
            connection.executescript(sql)
            info = table_info(connection, "payments")
            names = [row[1].lower() for row in info]
            foreign_keys = connection.execute("PRAGMA foreign_key_list(payments)").fetchall()
            results = [
                {"name": "创建 payments 表", "passed": names == ["id", "order_id", "amount", "status"], "actual": names, "expected": ["id", "order_id", "amount", "status"]},
                {"name": "order_id 外键", "passed": any(row[2].lower() == "orders" and row[3].lower() == "order_id" for row in foreign_keys), "actual": [row[2:5] for row in foreign_keys], "expected": [["orders", "order_id", "id"]]},
            ]
            invalid_checks = []
            for statement in (
                "INSERT INTO payments VALUES (1,101,-1,'paid')",
                "INSERT INTO payments VALUES (2,999,10,'paid')",
                "INSERT INTO payments VALUES (3,101,10,'unknown')",
            ):
                try:
                    connection.execute(statement)
                    invalid_checks.append(False)
                except sqlite3.IntegrityError:
                    invalid_checks.append(True)
            results.append({"name": "金额、引用与状态非法值均被拒绝", "passed": all(invalid_checks), "actual": invalid_checks, "expected": [True, True, True]})
        elif challenge_id == "mysql-transfer-transaction":
            connection.executescript("CREATE TABLE accounts(id INTEGER PRIMARY KEY, balance NUMERIC NOT NULL CHECK(balance >= 0)); INSERT INTO accounts VALUES (1,500),(2,200);")
            connection.executescript(sql)
            actual = rows(connection.execute("SELECT id,balance FROM accounts ORDER BY id"))
            has_boundary = bool(re.search(r"\b(BEGIN|START\s+TRANSACTION)\b", sql, re.I)) and bool(re.search(r"\bCOMMIT\b", sql, re.I))
            results = [
                {"name": "显式事务边界", "passed": has_boundary, "actual": has_boundary, "expected": True},
                {"name": "转账后余额", "passed": actual == [[1, 400], [2, 300]], "actual": actual, "expected": [[1, 400], [2, 300]]},
                {"name": "资金总额不变", "passed": sum(row[1] for row in actual) == 700, "actual": sum(row[1] for row in actual), "expected": 700},
            ]
        elif challenge_id == "mysql-composite-index":
            connection.executescript(sql)
            indexes = connection.execute("PRAGMA index_list(orders)").fetchall()
            indexed_columns = []
            for index in indexes:
                columns = [row[2].lower() for row in connection.execute(f"PRAGMA index_info({index[1]})")]
                indexed_columns.append(columns)
            expected = ["customer_id", "status", "created_at"]
            results = [
                {"name": "建立联合索引", "passed": expected in indexed_columns, "actual": indexed_columns, "expected": [expected]},
                {"name": "字段顺序符合等值、等值、范围", "passed": expected in indexed_columns, "actual": indexed_columns, "expected": [expected]},
            ]
        elif challenge_id == "mysql-enrollment-design":
            connection.executescript(sql)
            tables = {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            required = {"learners", "courses", "enrollments"}
            enrollment_info = table_info(connection, "enrollments")
            foreign_keys = connection.execute("PRAGMA foreign_key_list(enrollments)").fetchall()
            unique_pairs = []
            for index in connection.execute("PRAGMA index_list(enrollments)").fetchall():
                if index[2]:
                    unique_pairs.append([row[2].lower() for row in connection.execute(f"PRAGMA index_info({index[1]})")])
            results = [
                {"name": "三张实体/关系表", "passed": required.issubset(tables), "actual": sorted(tables & required), "expected": sorted(required)},
                {"name": "选课表有两个外键", "passed": len(foreign_keys) >= 2, "actual": len(foreign_keys), "expected": 2},
                {"name": "阻止重复选同一门课", "passed": ["learner_id", "course_id"] in unique_pairs, "actual": unique_pairs, "expected": [["learner_id", "course_id"]]},
                {"name": "选课表可被稳定标识", "passed": any(row[5] for row in enrollment_info), "actual": [row[1] for row in enrollment_info if row[5]], "expected": ["id 或联合主键"]},
            ]
        else:
            return {"ok": False, "message": "未知 SQL 挑战"}
    except (sqlite3.Error, ValueError) as error:
        return {"ok": False, "message": f"SQL 执行失败：{error}"}
    finally:
        connection.close()

    passed = all(item["passed"] for item in results)
    return {
        "ok": passed,
        "message": "全部 SQL 验收通过" if passed else "还有检查未通过，请根据结果修改",
        "results": results,
    }


def main():
    try:
        payload = json.load(sys.stdin)
        print(json.dumps(evaluate(payload.get("challengeId"), payload.get("code")), ensure_ascii=False))
    except Exception as error:
        print(json.dumps({"ok": False, "message": f"验收器错误：{error}"}, ensure_ascii=False))


if __name__ == "__main__":
    main()
