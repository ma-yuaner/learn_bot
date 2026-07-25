import test from "node:test";
import assert from "node:assert/strict";
import { firstLesson, tracks } from "../data/curriculum.js";

test("课程地图覆盖全部培训主题", () => {
  assert.equal(tracks.length, 11);
  assert.ok(tracks.every((track) => track.id && track.title && track.chapters.length > 0));
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
