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
    }
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
    "range": range,
    "set": set,
    "sorted": sorted,
    "str": str,
    "sum": sum,
    "tuple": tuple,
    "ValueError": ValueError,
}

ALLOWED_ATTRIBUTES = {"append", "count", "get", "items", "keys", "lower", "split", "strip", "values"}
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
        if isinstance(node.func, ast.Name) and node.func.id not in SAFE_BUILTINS:
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
