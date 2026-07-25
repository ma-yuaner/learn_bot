import test from "node:test";
import assert from "node:assert/strict";
import { assessmentLevels, firstLesson, pythonLessons, tracks } from "../data/curriculum.js";
import { simulateExpedition } from "../lib/expedition.js";

test("课程地图覆盖培训主题和现代 AI 工程补充路线", () => {
  assert.equal(tracks.length, 22);
  assert.ok(tracks.every((track) => track.id && track.title && track.chapters.length > 0));
  const ids = new Set(tracks.map((track) => track.id));
  for (const required of ["git", "engineering", "architecture-decisions", "web-api", "deployment", "security", "mlops", "llm", "rag", "agent", "ai-evaluation"]) {
    assert.ok(ids.has(required), `缺少扩展区域：${required}`);
  }
});

test("首关具备完整的学习闭环", () => {
  assert.equal(firstLesson.objectives.length, 4);
  assert.ok(firstLesson.concepts.length >= 4);
  assert.ok(firstLesson.types.length >= 4);
  assert.ok(firstLesson.prediction.answer);
  assert.ok(firstLesson.quiz.length >= 3);
});

test("每道题都有合法答案与反馈", () => {
  for (const question of firstLesson.quiz) {
    assert.ok(question.options[question.answer]);
    assert.ok(question.reason.length > 10);
  }
});

test("考核覆盖知识点到面试的完整层级", () => {
  assert.deepEqual(assessmentLevels.map((item) => item.level), ["L1", "L2", "L3", "L4", "L5"]);
  assert.ok(assessmentLevels.every((item) => item.evidence && item.pass));
});

test("每个 Python 关卡都符合可复用课程协议", () => {
  assert.equal(pythonLessons.length, 13);
  const ids = new Set();
  for (const lesson of pythonLessons) {
    assert.ok(!ids.has(lesson.id), `关卡 ID 重复：${lesson.id}`);
    ids.add(lesson.id);
    assert.equal(lesson.objectives.length, 4);
    assert.ok(lesson.concepts.length >= 4);
    assert.ok(lesson.types.length >= 4);
    assert.ok(lesson.prediction.choices.includes(lesson.prediction.answer));
    assert.ok(lesson.lab.kind);
    assert.ok(lesson.debugChallenge.choices[lesson.debugChallenge.answer]);
    assert.ok(lesson.debugChallenge.error);
    assert.ok(lesson.debugChallenge.result);
    assert.ok(lesson.quiz.length >= 3);
    assert.ok(lesson.evaluationGroups.length >= 4);
    assert.ok(lesson.referenceAnswer.length >= 80, `${lesson.id} 缺少完整参考解释`);
    if (lesson.moduleProject) {
      assert.ok(lesson.moduleProject.title.startsWith("L2"));
      assert.ok(lesson.moduleProject.requirements.length >= 5);
    }
    if (lesson.codeChallenge) {
      assert.ok(lesson.codeChallenge.id);
      assert.match(lesson.codeChallenge.starter, /^def /);
      assert.ok(lesson.codeChallenge.checks.length >= 3);
    }
    if (lesson.graduation) {
      assert.ok(lesson.graduation.title.includes("L3"));
      assert.ok(lesson.graduation.requirements.length >= 6);
    }
  }
});

test("Python 平原覆盖培训讲义后半程关键主题", () => {
  const ids = new Set(pythonLessons.map((lesson) => lesson.id));
  for (const id of ["python-oop", "python-modules", "python-advanced", "python-concurrency", "python-network", "python-engineering"]) {
    assert.ok(ids.has(id), `缺少 Python 关卡：${id}`);
  }
  assert.ok(pythonLessons.at(-1).graduation);
  assert.deepEqual(
    new Set(pythonLessons.map((lesson) => lesson.lab.kind)),
    new Set(["variables", "expressions", "conditions", "loops", "collections", "functions", "files", "oop", "modules", "advanced", "concurrency", "network", "architecture"])
  );
});

test("资源探险模拟器覆盖正常、边界、异常和天气分支", () => {
  assert.deepEqual(
    simulateExpedition(14, 3, "sunny"),
    { ok: true, rounds: 4, energy: 2, cost: 3, reason: "剩余能量不足，安全停止" }
  );
  assert.equal(simulateExpedition(9, 3, "sunny").energy, 0);
  assert.equal(simulateExpedition(10, 0, "sunny").ok, false);
  assert.equal(simulateExpedition(-1, 3, "sunny").ok, false);
  assert.equal(simulateExpedition(15, 3, "storm").rounds, 3);
});
