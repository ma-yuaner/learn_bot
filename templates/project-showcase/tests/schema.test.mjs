import test from "node:test";
import assert from "node:assert/strict";
import { project } from "../project.config.js";
import { modules } from "../data/modules.js";
import { validateShowcase } from "../lib/schema.js";

test("示例项目满足通用展示协议", () => {
  assert.deepEqual(validateShowcase(project, modules), []);
});

test("协议拒绝重复模块和无效架构边", () => {
  const broken = structuredClone(modules);
  broken[1].id = broken[0].id;
  broken[0].architecture.edges.push({ from: "missing", to: "server", label: "错误边" });
  const errors = validateShowcase(project, broken);
  assert.ok(errors.some((error) => error.includes("重复")));
  assert.ok(errors.some((error) => error.includes("不存在的节点")));
});
