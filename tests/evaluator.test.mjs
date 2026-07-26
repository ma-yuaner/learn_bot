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

test("索引链表挑战反转可达节点并保留不可达节点", () => {
  const result = evaluate(`
def reverse_index_chain(next_indices, head):
    links = next_indices[:]
    previous = -1
    current = head
    while current != -1:
        next_node = links[current]
        links[current] = previous
        previous = current
        current = next_node
    order = []
    current = previous
    while current != -1:
        order.append(current)
        current = links[current]
    return {"head": previous, "next": links, "order": order}
  `.trim(), "reverse-index-chain");
  assert.equal(result.ok, true);
  assert.equal(result.results.length, 4);
  assert.ok(result.results.every((item) => item.passed));
});

test("算法迷宫剩余章节的代码挑战全部通过公开与隐藏测试", () => {
  const solutions = [
    ["stack-brackets", `
def check_brackets(text):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    max_depth = 0
    for char in text:
        if char in "([{":
            stack.append(char)
            max_depth = max(max_depth, len(stack))
        elif char in ")]}":
            if not stack or stack.pop() != pairs[char]:
                return {"valid": False, "max_depth": max_depth}
    return {"valid": not stack, "max_depth": max_depth}
    `],
    ["queue-events", `
def run_queue(operations):
    data = []
    head = 0
    dequeued = []
    for operation in operations:
        if operation == "dequeue":
            if head < len(data):
                dequeued.append(data[head])
                head = head + 1
            else:
                dequeued.append(None)
        else:
            parts = operation.split(":")
            data.append(parts[1])
    return {"dequeued": dequeued, "remaining": data[head:]}
    `],
    ["hash-buckets", `
def bucketize(keys, bucket_count):
    buckets = [[] for _ in range(bucket_count)]
    collisions = 0
    for key in keys:
        index = sum(ord(char) for char in key) % bucket_count
        if buckets[index]:
            collisions = collisions + 1
        buckets[index].append(key)
    return {"buckets": buckets, "collisions": collisions, "load": len(keys) / bucket_count}
    `],
    ["tree-height", `
def array_tree_height(values):
    if not values or values[0] is None:
        return 0
    stack = [(0, 1)]
    height = 0
    while stack:
        index, depth = stack.pop()
        if index >= len(values) or values[index] is None:
            continue
        height = max(height, depth)
        stack.append((index * 2 + 1, depth + 1))
        stack.append((index * 2 + 2, depth + 1))
    return height
    `],
    ["bst-search-path", `
def bst_search(values, target):
    path = []
    index = 0
    while index < len(values) and values[index] is not None:
        value = values[index]
        path.append(value)
        if value == target:
            return {"path": path, "found": True}
        if target < value:
            index = index * 2 + 1
        else:
            index = index * 2 + 2
    return {"path": path, "found": False}
    `],
    ["heap-push", `
def min_heap_push(heap, value):
    data = heap[:]
    data.append(value)
    index = len(data) - 1
    swaps = 0
    while index > 0:
        parent = (index - 1) // 2
        if data[parent] <= data[index]:
            break
        data[parent], data[index] = data[index], data[parent]
        swaps = swaps + 1
        index = parent
    return {"heap": data, "swaps": swaps}
    `],
    ["graph-bfs", `
def bfs_distances(adjacency, start):
    distances = [-1] * len(adjacency)
    distances[start] = 0
    queue = [start]
    head = 0
    while head < len(queue):
        node = queue[head]
        head = head + 1
        for neighbor in adjacency[node]:
            if distances[neighbor] == -1:
                distances[neighbor] = distances[node] + 1
                queue.append(neighbor)
    return distances
    `],
    ["insertion-sort-shifts", `
def insertion_sort_with_shifts(values):
    data = values[:]
    shifts = 0
    for index in range(1, len(data)):
        key = data[index]
        position = index - 1
        while position >= 0 and data[position] > key:
            data[position + 1] = data[position]
            shifts = shifts + 1
            position = position - 1
        data[position + 1] = key
    return {"values": data, "shifts": shifts}
    `],
    ["binary-search-trace", `
def binary_search_trace(values, target):
    left = 0
    right = len(values) - 1
    probes = []
    while left <= right:
        mid = (left + right) // 2
        probes.append(mid)
        if values[mid] == target:
            return {"index": mid, "probes": probes}
        if values[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return {"index": -1, "probes": probes}
    `],
    ["recursive-sum", `
def recursive_sum(values):
    if not values:
        return 0
    return values[0] + recursive_sum(values[1:])
    `],
    ["generate-subsets", `
def generate_subsets(values):
    if not values:
        return [[]]
    rest = generate_subsets(values[1:])
    result = []
    for subset in rest:
        result.append(subset)
    for subset in rest:
        result.append([values[0]] + subset)
    return result
    `],
    ["climb-ways", `
def climb_ways(n):
    if n < 0:
        return 0
    previous = 1
    current = 1
    for _ in range(2, n + 1):
        previous, current = current, previous + current
    return current
    `],
    ["recommend-structure", `
def recommend_structure(requirements):
    if "priority" in requirements:
        return "heap"
    if "key_lookup" in requirements and "recency" in requirements:
        return "hash+doubly-linked-list"
    if "fifo" in requirements:
        return "queue"
    if "lifo" in requirements:
        return "stack"
    if "random_index" in requirements:
        return "dynamic-array"
    return "list"
    `]
  ];

  for (const [challengeId, code] of solutions) {
    const result = evaluate(code.trim(), challengeId);
    assert.equal(result.ok, true, `${challengeId}: ${result.message}`);
    assert.ok(result.results.every((item) => item.passed), challengeId);
  }
});
