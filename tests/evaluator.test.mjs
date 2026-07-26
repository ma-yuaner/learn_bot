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

test("成绩分析挑战检查返回值、空列表和通过边界", () => {
  const result = evaluate(`
def analyze_scores(scores):
    if not scores:
        return {"total": 0, "average": 0, "passed": False}
    total = sum(scores)
    average = total / len(scores)
    return {"total": total, "average": average, "passed": average >= 60}
  `.trim(), "score-analysis");
  assert.equal(result.ok, true);
  assert.ok(result.results.every((item) => item.passed));
});

test("分数文本解析挑战处理异常、空行与范围边界", () => {
  const result = evaluate(`
def parse_score_lines(lines):
    scores = []
    invalid = 0
    for line in lines:
        text = line.strip()
        if not text:
            continue
        try:
            score = float(text)
        except ValueError:
            invalid = invalid + 1
            continue
        if 0 <= score <= 100:
            scores.append(score)
        else:
            invalid = invalid + 1
    return {"scores": scores, "invalid": invalid}
  `.trim(), "parse-score-lines");
  assert.equal(result.ok, true);
  assert.ok(result.results.every((item) => item.passed));
});

test("线性查找挑战验证索引和真实比较次数", () => {
  const result = evaluate(`
def linear_search_with_count(items, target):
    checks = 0
    for index, item in enumerate(items):
        checks = checks + 1
        if item == target:
            return {"index": index, "checks": checks}
    return {"index": -1, "checks": checks}
  `.trim(), "linear-search-count");
  assert.equal(result.ok, true);
  assert.equal(result.results.length, 4);
  assert.ok(result.results.every((item) => item.passed));
});

test("动态数组挑战验证倍增容量与历次复制成本", () => {
  const result = evaluate(`
def build_dynamic_array(values):
    capacity = 1
    size = 0
    copies = 0
    data = [None] * capacity
    for value in values:
        if size == capacity:
            new_data = [None] * (capacity * 2)
            for index in range(size):
                new_data[index] = data[index]
                copies = copies + 1
            data = new_data
            capacity = capacity * 2
        data[size] = value
        size = size + 1
    return {"data": data[:size], "size": size, "capacity": capacity, "copies": copies}
  `.trim(), "dynamic-array-append");
  assert.equal(result.ok, true);
  assert.equal(result.results.length, 4);
  assert.ok(result.results.every((item) => item.passed));
});
