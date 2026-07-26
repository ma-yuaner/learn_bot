import test from "node:test";
import assert from "node:assert/strict";
import {
  blankLessonProgress,
  graduationReadiness,
  isLessonPassed,
  lessonCheckpoints,
  lessonLearningState,
  missingCheckpointLabels
} from "../lib/progress.js";

const lesson = {
  id: "lesson-1",
  title: "01 · 测试关卡",
  codeChallenge: { id: "code-1" }
};

test("关卡必须完成全部基础检查点和代码验收才算通过", () => {
  const progress = {
    ...blankLessonProgress(),
    concept: true,
    prediction: true,
    workshop: true,
    debug: true,
    quiz: 100,
    explanation: 100,
    code: false
  };
  assert.equal(isLessonPassed(lesson, progress), false);
  assert.deepEqual(missingCheckpointLabels(lesson, progress), ["真实代码验收"]);
  progress.code = true;
  assert.equal(isLessonPassed(lesson, progress), true);
  assert.equal(lessonCheckpoints(lesson, progress).length, 7);
});

test("学习状态区分待学习、进行中和已通过", () => {
  const empty = blankLessonProgress();
  assert.equal(lessonLearningState(lesson, empty), "not_started");

  const started = { ...empty, prediction: true };
  assert.equal(lessonLearningState(lesson, started), "in_progress");

  const passed = {
    ...empty,
    concept: true,
    prediction: true,
    workshop: true,
    debug: true,
    quiz: 80,
    explanation: 60,
    code: true
  };
  assert.equal(lessonLearningState(lesson, passed), "passed");
});

test("区域毕业考核只有在所有前置关卡通过后解锁", () => {
  const graduationLesson = { id: "final", title: "03 · 毕业", graduation: { title: "L3" } };
  const lessons = [
    { id: "first", title: "01 · 第一关" },
    { id: "second", title: "02 · 第二关" },
    graduationLesson
  ];
  const complete = {
    concept: true,
    prediction: true,
    workshop: true,
    debug: true,
    quiz: 80,
    explanation: 60
  };
  const progressByLesson = {
    first: complete,
    second: { ...complete, workshop: false },
    final: complete
  };
  const locked = graduationReadiness(lessons, progressByLesson, "final");
  assert.equal(locked.unlocked, false);
  assert.deepEqual(locked.missingLessons, ["02 · 第二关"]);

  progressByLesson.second.workshop = true;
  assert.deepEqual(graduationReadiness(lessons, progressByLesson, "final"), {
    unlocked: true,
    missingLessons: []
  });
});
