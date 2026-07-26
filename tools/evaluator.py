import ast
import json
import resource
import signal
import sys


CHALLENGES = {
    "inventory-summary": {
        "function": "summarize_inventory",
        "tests": [
            {"name": "正常数据", "args": [["torch", "map", "torch"]], "expected": {"torch": 2, "map": 1}, "visible": True},
            {"name": "空列表", "args": [[]], "expected": {}, "visible": True},
            {"name": "单个物品", "args": [["map"]], "expected": {"map": 1}, "visible": False},
            {"name": "连续重复", "args": [["rope", "rope", "rope"]], "expected": {"rope": 3}, "visible": False},
        ],
    },
    "score-analysis": {
        "function": "analyze_scores",
        "tests": [
            {"name": "普通分数", "args": [[70, 80]], "expected": {"total": 150, "average": 75, "passed": True}, "visible": True},
            {"name": "空列表", "args": [[]], "expected": {"total": 0, "average": 0, "passed": False}, "visible": True},
            {"name": "通过边界", "args": [[60]], "expected": {"total": 60, "average": 60, "passed": True}, "visible": False},
            {"name": "小数平均值", "args": [[59, 60]], "expected": {"total": 119, "average": 59.5, "passed": False}, "visible": False},
        ],
    },
    "parse-score-lines": {
        "function": "parse_score_lines",
        "tests": [
            {"name": "混合内容", "args": [["80", "bad", "", "60"]], "expected": {"scores": [80, 60], "invalid": 1}, "visible": True},
            {"name": "空行与边界", "args": [["", "0", "100"]], "expected": {"scores": [0, 100], "invalid": 0}, "visible": True},
            {"name": "超出范围", "args": [["-1", "101", "50"]], "expected": {"scores": [50], "invalid": 2}, "visible": False},
            {"name": "小数分数", "args": [["59.5", "60.5"]], "expected": {"scores": [59.5, 60.5], "invalid": 0}, "visible": False},
        ],
    },
    "linear-search-count": {
        "function": "linear_search_with_count",
        "tests": [
            {"name": "目标在中间", "args": [["a", "b", "c"], "b"], "expected": {"index": 1, "checks": 2}, "visible": True},
            {"name": "目标不存在", "args": [["a", "b"], "x"], "expected": {"index": -1, "checks": 2}, "visible": True},
            {"name": "目标在第一项", "args": [[9, 8, 7], 9], "expected": {"index": 0, "checks": 1}, "visible": False},
            {"name": "空列表", "args": [[], 1], "expected": {"index": -1, "checks": 0}, "visible": False},
        ],
    },
    "dynamic-array-append": {
        "function": "build_dynamic_array",
        "tests": [
            {"name": "三个元素", "args": [[10, 20, 30]], "expected": {"data": [10, 20, 30], "size": 3, "capacity": 4, "copies": 3}, "visible": True},
            {"name": "空输入", "args": [[]], "expected": {"data": [], "size": 0, "capacity": 1, "copies": 0}, "visible": True},
            {"name": "单元素", "args": [["map"]], "expected": {"data": ["map"], "size": 1, "capacity": 1, "copies": 0}, "visible": False},
            {"name": "五个元素", "args": [[1, 2, 3, 4, 5]], "expected": {"data": [1, 2, 3, 4, 5], "size": 5, "capacity": 8, "copies": 7}, "visible": False},
        ],
    },
    "reverse-index-chain": {
        "function": "reverse_index_chain",
        "tests": [
            {"name": "三节点完整链", "args": [[1, 2, -1], 0], "expected": {"head": 2, "next": [-1, 0, 1], "order": [2, 1, 0]}, "visible": True},
            {"name": "空链", "args": [[], -1], "expected": {"head": -1, "next": [], "order": []}, "visible": True},
            {"name": "单节点", "args": [[-1], 0], "expected": {"head": 0, "next": [-1], "order": [0]}, "visible": False},
            {"name": "非零头与不可达节点", "args": [[-1, 3, -1, -1], 1], "expected": {"head": 3, "next": [-1, -1, -1, 1], "order": [3, 1]}, "visible": False},
        ],
    },
    "stack-brackets": {
        "function": "check_brackets",
        "tests": [
            {"name": "正确嵌套", "args": ["([]){}"], "expected": {"valid": True, "max_depth": 2}, "visible": True},
            {"name": "类型错配", "args": ["([)]"], "expected": {"valid": False, "max_depth": 2}, "visible": True},
            {"name": "多余右括号", "args": ["]"], "expected": {"valid": False, "max_depth": 0}, "visible": False},
            {"name": "空文本", "args": [""], "expected": {"valid": True, "max_depth": 0}, "visible": False},
        ],
    },
    "queue-events": {
        "function": "run_queue",
        "tests": [
            {"name": "交错操作", "args": [["enqueue:A", "enqueue:B", "dequeue", "enqueue:C"]], "expected": {"dequeued": ["A"], "remaining": ["B", "C"]}, "visible": True},
            {"name": "空队列出队", "args": [["dequeue"]], "expected": {"dequeued": [None], "remaining": []}, "visible": True},
            {"name": "只入队", "args": [["enqueue:X", "enqueue:Y"]], "expected": {"dequeued": [], "remaining": ["X", "Y"]}, "visible": False},
            {"name": "全部消费", "args": [["enqueue:X", "dequeue", "dequeue"]], "expected": {"dequeued": ["X", None], "remaining": []}, "visible": False},
        ],
    },
    "hash-buckets": {
        "function": "bucketize",
        "tests": [
            {"name": "存在冲突", "args": [["ab", "ba", "ad"], 3], "expected": {"buckets": [["ab", "ba"], [], ["ad"]], "collisions": 1, "load": 1.0}, "visible": True},
            {"name": "空键列表", "args": [[], 4], "expected": {"buckets": [[], [], [], []], "collisions": 0, "load": 0.0}, "visible": True},
            {"name": "单桶退化", "args": [["a", "b"], 1], "expected": {"buckets": [["a", "b"]], "collisions": 1, "load": 2.0}, "visible": False},
            {"name": "多桶分布", "args": [["a"], 2], "expected": {"buckets": [[], ["a"]], "collisions": 0, "load": 0.5}, "visible": False},
        ],
    },
    "tree-height": {
        "function": "array_tree_height",
        "tests": [
            {"name": "非完整树", "args": [["A", "B", "C", None, "E", None, "F"]], "expected": 3, "visible": True},
            {"name": "空树", "args": [[]], "expected": 0, "visible": True},
            {"name": "单节点", "args": [["root"]], "expected": 1, "visible": False},
            {"name": "稀疏右链", "args": [["A", None, "B", None, None, None, "C"]], "expected": 3, "visible": False},
        ],
    },
    "bst-search-path": {
        "function": "bst_search",
        "tests": [
            {"name": "命中深层节点", "args": [[8, 3, 10, 1, 6, None, 14, None, None, 4, 7, None, None, 13], 7], "expected": {"path": [8, 3, 6, 7], "found": True}, "visible": True},
            {"name": "目标不存在", "args": [[8, 3, 10, 1, 6, None, 14, None, None, 4, 7, None, None, 13], 5], "expected": {"path": [8, 3, 6, 4], "found": False}, "visible": True},
            {"name": "空树", "args": [[], 1], "expected": {"path": [], "found": False}, "visible": False},
            {"name": "根节点命中", "args": [[8, 3, 10], 8], "expected": {"path": [8], "found": True}, "visible": False},
        ],
    },
    "heap-push": {
        "function": "min_heap_push",
        "tests": [
            {"name": "上浮到根", "args": [[2, 5, 4, 9], 1], "expected": {"heap": [1, 2, 4, 9, 5], "swaps": 2}, "visible": True},
            {"name": "无需交换", "args": [[1, 3, 2], 4], "expected": {"heap": [1, 3, 2, 4], "swaps": 0}, "visible": True},
            {"name": "空堆", "args": [[], 5], "expected": {"heap": [5], "swaps": 0}, "visible": False},
            {"name": "上浮一层", "args": [[1, 4, 2, 9], 3], "expected": {"heap": [1, 3, 2, 9, 4], "swaps": 1}, "visible": False},
        ],
    },
    "graph-bfs": {
        "function": "bfs_distances",
        "tests": [
            {"name": "分叉图", "args": [[[1, 2], [3], [3], []], 0], "expected": [0, 1, 1, 2], "visible": True},
            {"name": "不可达点", "args": [[[1], [0], []], 0], "expected": [0, 1, -1], "visible": True},
            {"name": "单节点", "args": [[[]], 0], "expected": [0], "visible": False},
            {"name": "环图", "args": [[[1], [2], [0]], 0], "expected": [0, 1, 2], "visible": False},
        ],
    },
    "insertion-sort-shifts": {
        "function": "insertion_sort_with_shifts",
        "tests": [
            {"name": "逆序输入", "args": [[3, 2, 1]], "expected": {"values": [1, 2, 3], "shifts": 3}, "visible": True},
            {"name": "已有序", "args": [[1, 2, 3]], "expected": {"values": [1, 2, 3], "shifts": 0}, "visible": True},
            {"name": "重复值", "args": [[2, 1, 2]], "expected": {"values": [1, 2, 2], "shifts": 1}, "visible": False},
            {"name": "空列表", "args": [[]], "expected": {"values": [], "shifts": 0}, "visible": False},
        ],
    },
    "binary-search-trace": {
        "function": "binary_search_trace",
        "tests": [
            {"name": "命中", "args": [[2, 4, 6, 8, 10], 8], "expected": {"index": 3, "probes": [2, 3]}, "visible": True},
            {"name": "未命中", "args": [[2, 4, 6, 8, 10], 5], "expected": {"index": -1, "probes": [2, 0, 1]}, "visible": True},
            {"name": "空列表", "args": [[], 1], "expected": {"index": -1, "probes": []}, "visible": False},
            {"name": "单元素", "args": [[5], 5], "expected": {"index": 0, "probes": [0]}, "visible": False},
        ],
    },
    "recursive-sum": {
        "function": "recursive_sum",
        "tests": [
            {"name": "普通列表", "args": [[1, 2, 3, 4]], "expected": 10, "visible": True},
            {"name": "空列表", "args": [[]], "expected": 0, "visible": True},
            {"name": "含负数", "args": [[5, -2, -3]], "expected": 0, "visible": False},
            {"name": "单元素", "args": [[9]], "expected": 9, "visible": False},
        ],
    },
    "generate-subsets": {
        "function": "generate_subsets",
        "tests": [
            {"name": "两个元素", "args": [["A", "B"]], "expected": [[], ["B"], ["A"], ["A", "B"]], "visible": True},
            {"name": "空列表", "args": [[]], "expected": [[]], "visible": True},
            {"name": "单元素", "args": [["X"]], "expected": [[], ["X"]], "visible": False},
            {"name": "三个元素", "args": [[1, 2, 3]], "expected": [[], [3], [2], [2, 3], [1], [1, 3], [1, 2], [1, 2, 3]], "visible": False},
        ],
    },
    "climb-ways": {
        "function": "climb_ways",
        "tests": [
            {"name": "五阶", "args": [5], "expected": 8, "visible": True},
            {"name": "零阶", "args": [0], "expected": 1, "visible": True},
            {"name": "负数", "args": [-2], "expected": 0, "visible": False},
            {"name": "十阶", "args": [10], "expected": 89, "visible": False},
        ],
    },
    "recommend-structure": {
        "function": "recommend_structure",
        "tests": [
            {"name": "优先级最高", "args": [["fifo", "priority"]], "expected": "heap", "visible": True},
            {"name": "LRU 组合", "args": [["key_lookup", "recency"]], "expected": "hash+doubly-linked-list", "visible": True},
            {"name": "FIFO", "args": [["fifo"]], "expected": "queue", "visible": False},
            {"name": "LIFO", "args": [["lifo"]], "expected": "stack", "visible": False},
            {"name": "随机索引", "args": [["random_index"]], "expected": "dynamic-array", "visible": False},
            {"name": "默认", "args": [[]], "expected": "list", "visible": False},
        ],
    }
}

GENERIC_CHALLENGES = {
    "stack-brackets",
    "queue-events",
    "hash-buckets",
    "tree-height",
    "bst-search-path",
    "heap-push",
    "graph-bfs",
    "insertion-sort-shifts",
    "binary-search-trace",
    "recursive-sum",
    "generate-subsets",
    "climb-ways",
    "recommend-structure",
}

SAFE_BUILTINS = {
    "abs": abs,
    "bool": bool,
    "dict": dict,
    "enumerate": enumerate,
    "float": float,
    "int": int,
    "len": len,
    "list": list,
    "max": max,
    "min": min,
    "ord": ord,
    "range": range,
    "set": set,
    "sorted": sorted,
    "str": str,
    "sum": sum,
    "tuple": tuple,
    "ValueError": ValueError,
}

ALLOWED_ATTRIBUTES = {"append", "count", "get", "items", "keys", "lower", "pop", "split", "strip", "values"}
BANNED_NODES = (
    ast.AsyncFunctionDef,
    ast.Await,
    ast.ClassDef,
    ast.Delete,
    ast.Global,
    ast.Import,
    ast.ImportFrom,
    ast.Lambda,
    ast.Nonlocal,
    ast.Raise,
    ast.With,
    ast.Yield,
    ast.YieldFrom,
)


class SafetyVisitor(ast.NodeVisitor):
    def __init__(self, expected_function):
        self.expected_function = expected_function
        self.errors = []

    def visit(self, node):
        if isinstance(node, BANNED_NODES):
            self.errors.append(f"不允许使用 {type(node).__name__}")
            return
        super().visit(node)

    def visit_Module(self, node):
        functions = [item for item in node.body if isinstance(item, ast.FunctionDef)]
        if len(node.body) != 1 or len(functions) != 1:
            self.errors.append("顶层只能定义题目要求的一个函数")
        self.generic_visit(node)

    def visit_FunctionDef(self, node):
        if node.name != self.expected_function:
            self.errors.append(f"函数名必须是 {self.expected_function}")
        if node.decorator_list:
            self.errors.append("不允许使用装饰器")
        self.generic_visit(node)

    def visit_Name(self, node):
        if node.id.startswith("__"):
            self.errors.append("不允许访问双下划线名称")

    def visit_Attribute(self, node):
        if node.attr.startswith("_") or node.attr not in ALLOWED_ATTRIBUTES:
            self.errors.append(f"不允许访问属性 {node.attr}")
        self.visit(node.value)

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name) and node.func.id not in SAFE_BUILTINS and node.func.id != self.expected_function:
            self.errors.append(f"不允许调用 {node.func.id}")
        elif not isinstance(node.func, (ast.Name, ast.Attribute)):
            self.errors.append("不允许这种动态调用方式")
        self.generic_visit(node)


def apply_limits():
    def lower_soft_limit(limit_name, desired):
        _, hard = resource.getrlimit(limit_name)
        resource.setrlimit(limit_name, (min(desired, hard), hard))

    lower_soft_limit(resource.RLIMIT_CPU, 1)
    lower_soft_limit(resource.RLIMIT_FSIZE, 0)
    lower_soft_limit(resource.RLIMIT_NOFILE, 16)
    if sys.platform.startswith("linux"):
        lower_soft_limit(resource.RLIMIT_AS, 256 * 1024 * 1024)
    signal.alarm(2)


def fail(message, category="validation"):
    return {"ok": False, "category": category, "message": message}


def is_small_json_value(value, depth=0):
    if depth > 8:
        return False
    if value is None or isinstance(value, (bool, str)):
        return not isinstance(value, str) or len(value) <= 1000
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return abs(value) < 10 ** 100
    if isinstance(value, list):
        return len(value) <= 200 and all(is_small_json_value(item, depth + 1) for item in value)
    if isinstance(value, dict):
        return (
            len(value) <= 100
            and all(isinstance(key, str) and len(key) <= 100 for key in value)
            and all(is_small_json_value(item, depth + 1) for item in value.values())
        )
    return False


def validate_result(challenge_id, actual):
    if challenge_id == "inventory-summary":
        valid = (
            isinstance(actual, dict)
            and len(actual) <= 100
            and all(
                isinstance(key, str)
                and len(key) <= 100
                and isinstance(value, int)
                and not isinstance(value, bool)
                and value >= 0
                for key, value in actual.items()
            )
        )
        return valid, "返回值必须是“字符串 → 非负整数”的小型字典"

    if challenge_id == "score-analysis":
        valid = (
            isinstance(actual, dict)
            and set(actual) == {"total", "average", "passed"}
            and isinstance(actual["total"], (int, float))
            and not isinstance(actual["total"], bool)
            and isinstance(actual["average"], (int, float))
            and not isinstance(actual["average"], bool)
            and isinstance(actual["passed"], bool)
        )
        return valid, "返回值必须包含 total、average、passed，且类型正确"

    if challenge_id == "linear-search-count":
        valid = (
            isinstance(actual, dict)
            and set(actual) == {"index", "checks"}
            and isinstance(actual["index"], int)
            and not isinstance(actual["index"], bool)
            and actual["index"] >= -1
            and isinstance(actual["checks"], int)
            and not isinstance(actual["checks"], bool)
            and actual["checks"] >= 0
        )
        return valid, "返回值必须包含 index 和 checks 两个整数，且 index 不小于 -1、checks 非负"

    if challenge_id == "dynamic-array-append":
        valid = (
            isinstance(actual, dict)
            and set(actual) == {"data", "size", "capacity", "copies"}
            and isinstance(actual["data"], list)
            and len(actual["data"]) <= 100
            and isinstance(actual["size"], int)
            and not isinstance(actual["size"], bool)
            and actual["size"] == len(actual["data"])
            and isinstance(actual["capacity"], int)
            and not isinstance(actual["capacity"], bool)
            and actual["capacity"] >= max(1, actual["size"])
            and isinstance(actual["copies"], int)
            and not isinstance(actual["copies"], bool)
            and actual["copies"] >= 0
        )
        return valid, "返回值必须包含 data、size、capacity、copies，且满足 size=len(data)≤capacity、capacity≥1、copies 非负"

    if challenge_id == "reverse-index-chain":
        valid = (
            isinstance(actual, dict)
            and set(actual) == {"head", "next", "order"}
            and isinstance(actual["head"], int)
            and not isinstance(actual["head"], bool)
            and isinstance(actual["next"], list)
            and len(actual["next"]) <= 100
            and all(
                isinstance(value, int)
                and not isinstance(value, bool)
                and -1 <= value < len(actual["next"])
                for value in actual["next"]
            )
            and -1 <= actual["head"] < len(actual["next"])
            and isinstance(actual["order"], list)
            and len(actual["order"]) <= len(actual["next"])
            and len(set(actual["order"])) == len(actual["order"])
            and all(
                isinstance(value, int)
                and not isinstance(value, bool)
                and 0 <= value < len(actual["next"])
                for value in actual["order"]
            )
        )
        return valid, "返回值必须包含合法的 head、next 索引列表和不重复的 order 索引列表"

    if challenge_id in GENERIC_CHALLENGES:
        return is_small_json_value(actual), "返回值必须是规模受限的 JSON 基础值、列表或字符串键字典"

    valid = (
        isinstance(actual, dict)
        and set(actual) == {"scores", "invalid"}
        and isinstance(actual["scores"], list)
        and len(actual["scores"]) <= 100
        and all(isinstance(value, (int, float)) and not isinstance(value, bool) and 0 <= value <= 100 for value in actual["scores"])
        and isinstance(actual["invalid"], int)
        and not isinstance(actual["invalid"], bool)
        and actual["invalid"] >= 0
    )
    return valid, "返回值必须包含 scores 列表和 invalid 非负整数"


def evaluate(payload):
    challenge = CHALLENGES.get(payload.get("challengeId"))
    if not challenge:
        return fail("未知的练习编号")

    code = payload.get("code", "")
    if not isinstance(code, str) or not code.strip():
        return fail("请先编写代码")
    if len(code) > 10_000:
        return fail("代码不能超过 10000 个字符")

    try:
        tree = ast.parse(code, mode="exec")
    except SyntaxError as error:
        return fail(f"第 {error.lineno} 行语法错误：{error.msg}", "syntax")

    visitor = SafetyVisitor(challenge["function"])
    visitor.visit(tree)
    if visitor.errors:
        return fail("；".join(dict.fromkeys(visitor.errors)), "safety")

    namespace = {"__builtins__": SAFE_BUILTINS}
    try:
        compiled = compile(tree, "<learner-code>", "exec")
        exec(compiled, namespace, namespace)
        learner_function = namespace[challenge["function"]]
        results = []
        for case in challenge["tests"]:
            actual = learner_function(*case["args"])
            valid_result, contract_error = validate_result(payload["challengeId"], actual)
            passed = valid_result and actual == case["expected"]
            results.append({
                "name": case["name"] if case["visible"] else "隐藏测试",
                "passed": passed,
                "actual": actual if case["visible"] and valid_result else (contract_error if case["visible"] else None),
                "expected": case["expected"] if case["visible"] else None,
            })
        return {
            "ok": all(item["passed"] for item in results),
            "category": "tests",
            "message": "全部测试通过" if all(item["passed"] for item in results) else "仍有测试未通过",
            "results": results,
        }
    except (MemoryError, TimeoutError):
        return fail("程序超过资源限制", "runtime")
    except Exception as error:
        return fail(f"{type(error).__name__}: {error}", "runtime")


def main():
    apply_limits()
    try:
        payload = json.loads(sys.stdin.read())
        result = evaluate(payload)
    except Exception as error:
        result = fail(f"验收器错误：{type(error).__name__}", "internal")
    sys.stdout.write(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
