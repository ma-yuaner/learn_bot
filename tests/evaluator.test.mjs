import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const evaluatorPath = join(projectRoot, "tools", "evaluator.py");

function evaluate(code, challengeId = "inventory-summary") {
  const result = spawnSync("python3", ["-I", "-S", evaluatorPath], {
    cwd: projectRoot,
    input: JSON.stringify({ challengeId, code }),
    encoding: "utf8",
    timeout: 3_000
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("受限执行器运行正确的物品计数实现", () => {
  const result = evaluate(`
def summarize_inventory(items):
    counts = {}
    for item in items:
        counts[item] = counts.get(item, 0) + 1
    return counts
  `.trim());
  assert.equal(result.ok, true);
  assert.equal(result.results.length, 4);
  assert.ok(result.results.every((item) => item.passed));
});

test("受限执行器报告语法错误", () => {
  const result = evaluate("def summarize_inventory(items)\n    return {}");
  assert.equal(result.ok, false);
  assert.equal(result.category, "syntax");
});

test("受限执行器拒绝导入与危险属性", () => {
  const imported = evaluate("import os\ndef summarize_inventory(items):\n    return {}");
  assert.equal(imported.category, "safety");
  assert.match(imported.message, /Import/);

  const reflected = evaluate("def summarize_inventory(items):\n    return items.__class__");
  assert.equal(reflected.category, "safety");
  assert.match(reflected.message, /__class__/);
});
