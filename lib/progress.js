export const blankLessonProgress = () => ({
  concept: false,
  prediction: false,
  workshop: false,
  debug: false,
  quiz: 0,
  explanation: 0,
  project: false,
  code: false
});

export function lessonCheckpoints(lesson, progress = blankLessonProgress()) {
  const checkpoints = [
    { id: "concept", label: "核心概念确认", passed: progress.concept === true },
    { id: "prediction", label: "代码预测", passed: progress.prediction === true },
    { id: "workshop", label: "交互实验", passed: progress.workshop === true },
    { id: "debug", label: "故障诊断", passed: progress.debug === true },
    { id: "quiz", label: "测验达到 80 分", passed: Number(progress.quiz) >= 80 },
    { id: "explanation", label: "解释达到 60 分", passed: Number(progress.explanation) >= 60 }
  ];
  if (lesson.moduleProject) checkpoints.push({ id: "project", label: "模块项目验收", passed: progress.project === true });
  if (lesson.codeChallenge) checkpoints.push({ id: "code", label: "真实代码验收", passed: progress.code === true });
  return checkpoints;
}

export function isLessonPassed(lesson, progress) {
  return lessonCheckpoints(lesson, progress).every((checkpoint) => checkpoint.passed);
}

export function lessonLearningState(lesson, progress = blankLessonProgress()) {
  const checkpoints = lessonCheckpoints(lesson, progress);
  if (checkpoints.every((checkpoint) => checkpoint.passed)) return "passed";
  if (checkpoints.some((checkpoint) => checkpoint.passed) || Number(progress.quiz) > 0 || Number(progress.explanation) > 0) {
    return "in_progress";
  }
  return "not_started";
}

export function missingCheckpointLabels(lesson, progress) {
  return lessonCheckpoints(lesson, progress)
    .filter((checkpoint) => !checkpoint.passed)
    .map((checkpoint) => checkpoint.label);
}

export function graduationReadiness(trackLessons, progressByLesson, graduationLessonId) {
  const graduationIndex = trackLessons.findIndex((lesson) => lesson.id === graduationLessonId);
  if (graduationIndex < 0) return { unlocked: false, missingLessons: [] };
  const prerequisites = trackLessons.slice(0, graduationIndex + 1);
  const missingLessons = prerequisites
    .filter((lesson) => !isLessonPassed(lesson, progressByLesson[lesson.id] || blankLessonProgress()))
    .map((lesson) => lesson.title);
  return { unlocked: missingLessons.length === 0, missingLessons };
}
