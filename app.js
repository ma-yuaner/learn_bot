import { assessmentLevels, pythonLessons, tracks } from "./data/curriculum.js";

const storageKey = "ai-explorer-progress-v2";
const legacyStorageKey = "ai-explorer-progress-v1";
const blankLessonProgress = () => ({
  concept: false,
  prediction: false,
  workshop: false,
  debug: false,
  quiz: 0,
  explanation: 0
});

let state = loadState();

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored?.lessons) return stored;
  } catch {
    // 损坏的本地数据不应阻止课程启动。
  }

  const initial = {
    activeLessonId: pythonLessons[0].id,
    lessons: Object.fromEntries(pythonLessons.map((lesson) => [lesson.id, blankLessonProgress()]))
  };

  try {
    const legacy = JSON.parse(localStorage.getItem(legacyStorageKey));
    if (legacy) initial.lessons[pythonLessons[0].id] = { ...blankLessonProgress(), ...legacy };
  } catch {
    // 旧进度迁移失败时使用全新进度。
  }
  return initial;
}

function currentLesson() {
  return pythonLessons.find((lesson) => lesson.id === state.activeLessonId) || pythonLessons[0];
}

function currentProgress() {
  state.lessons[state.activeLessonId] ??= blankLessonProgress();
  return state.lessons[state.activeLessonId];
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  renderProgress();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderStaticContent() {
  document.querySelector("#track-list").innerHTML = tracks.map((track) => `
    <button class="track-link ${track.available ? "active" : ""}" data-track="${track.id}">
      <span class="track-icon">${track.icon}</span>
      <span>${track.title}<small>${track.chapters.length} 个章节</small></span>
    </button>
  `).join("");

  document.querySelector("#world-map").innerHTML = tracks.map((track, index) => `
    <article class="region ${track.available ? "available" : ""}">
      <span class="region-icon">${track.icon}</span>
      <small>REGION ${String(index + 1).padStart(2, "0")}</small>
      <h3>${track.title}</h3>
      <p>${track.description}</p>
      <small>${track.available ? `${pythonLessons.length} 个关卡已开放` : `${track.chapters.length} 个关卡 · 待解锁`}</small>
    </article>
  `).join("");

  document.querySelector("#assessment-levels").innerHTML = assessmentLevels.map((item) => `
    <article class="assessment-level">
      <span>${item.level}</span>
      <h3>${item.title}</h3>
      <p>${item.evidence}</p>
      <small>通过标准</small>
      <b>${item.pass}</b>
    </article>
  `).join("");

  renderLessonSwitcher();
}

function renderLessonSwitcher() {
  document.querySelector("#lesson-switcher").innerHTML = pythonLessons.map((lesson, index) => {
    const progress = state.lessons[lesson.id] || blankLessonProgress();
    const passed = progress.quiz >= 80 && progress.explanation >= 60 && progress.debug;
    return `
      <button class="${lesson.id === state.activeLessonId ? "active" : ""}" data-lesson="${lesson.id}">
        <span>${String(index + 1).padStart(2, "0")}</span>${passed ? "已通过" : "学习"}
      </button>
    `;
  }).join("");
}

function renderLesson() {
  const lesson = currentLesson();
  document.querySelector("#lesson-title").textContent = lesson.title;
  document.querySelector("#lesson-duration").textContent = lesson.duration;
  document.querySelector(".current-mission > p").textContent = lesson.objectives[3];
  document.querySelector("#objectives").innerHTML = lesson.objectives.map((item) => `<li>${item}</li>`).join("");
  document.querySelector("#concept-grid").innerHTML = lesson.concepts.map((item) => `
    <article class="concept-card"><b>${item.term}</b><p>${item.detail}</p></article>
  `).join("");
  document.querySelector("#reference-title").textContent = lesson.referenceTitle;
  document.querySelector("#reference-description").textContent = lesson.referenceDescription;
  document.querySelector("#type-rows").innerHTML = lesson.types.map((row) => `
    <div class="type-row"><code>${row[0]}</code><b>${row[1]}</b><span>${row[2]}</span><span>${row[3]}</span></div>
  `).join("");
  document.querySelector("#prediction-code").textContent = lesson.prediction.code;
  document.querySelector("#prediction-choices").innerHTML = lesson.prediction.choices.map((choice) =>
    `<button class="choice" data-answer="${choice}">${choice}</button>`
  ).join("");
  document.querySelector("#prediction-feedback").className = "feedback";

  document.querySelector("#lab-title").textContent = lesson.lab.title;
  document.querySelector("#lab-subtitle").textContent = lesson.lab.subtitle;
  renderWorkbench(lesson.lab.kind);
  document.querySelector("#terminal-output").textContent = "等待运行…";
  document.querySelector("#state-trace").innerHTML = "";

  document.querySelector("#debug-code").textContent = lesson.debugChallenge.code;
  document.querySelector("#debug-question").textContent = lesson.debugChallenge.question;
  document.querySelector("#debug-choices").innerHTML = lesson.debugChallenge.choices.map((choice, index) =>
    `<button class="choice" data-debug-answer="${index}">${choice}</button>`
  ).join("");
  document.querySelector("#debug-feedback").className = "feedback";

  document.querySelector("#quiz-questions").innerHTML = lesson.quiz.map((quiz, questionIndex) => `
    <section class="quiz-question">
      <h3>${questionIndex + 1}. ${quiz.question}</h3>
      ${quiz.options.map((option, optionIndex) => `
        <label><input type="radio" name="quiz-${questionIndex}" value="${optionIndex}" />${option}</label>
      `).join("")}
    </section>
  `).join("");
  document.querySelector("#quiz-form").reset();
  document.querySelector("#quiz-result").className = "feedback";
  document.querySelector("#explanation-question").textContent = lesson.explanationChallenge;
  document.querySelector("#explanation-input").placeholder = `请用自己的话回答。${lesson.explanationHint}`;
  document.querySelector("#explanation-input").value = "";
  document.querySelector("#explanation-feedback").className = "feedback";
  document.querySelector("#concept-checkpoint-label").textContent = "我能用自己的话讲清本关四个核心概念及它们之间的关系。";

  bindLessonInteractions();
  renderLessonSwitcher();
  renderProgress();
}

function renderWorkbench(kind) {
  const controls = document.querySelector("#workbench-controls");
  if (kind === "variables") {
    controls.innerHTML = `
      <label>探险家名字<input id="name-input" value="小码" maxlength="12" /></label>
      <label>初始能量<input id="energy-input" type="number" value="80" min="0" max="100" /></label>
      <label>补给数量<input id="supply-input" type="range" value="15" min="0" max="30" /><output id="supply-output">15</output></label>
      <button class="primary-button" id="run-workbench">运行程序 <span>▶</span></button>
    `;
    const range = document.querySelector("#supply-input");
    range.addEventListener("input", () => { document.querySelector("#supply-output").value = range.value; });
    return;
  }

  controls.innerHTML = `
    <label>物品单价 price<input id="price-input" type="number" value="19" min="0" max="999" /></label>
    <label>购买数量 count<input id="count-input" type="number" value="3" min="1" max="99" /></label>
    <label>优惠金额 coupon<input id="coupon-input" type="number" value="5" min="0" max="999" /></label>
    <button class="primary-button" id="run-workbench">计算表达式 <span>▶</span></button>
  `;
}

function masteryScores(progress) {
  return {
    知识: progress.concept ? 100 : 0,
    推理: progress.prediction ? 100 : 0,
    实操: progress.workshop ? 100 : 0,
    排错: progress.debug ? 100 : 0,
    表达: Math.round((progress.quiz + progress.explanation) / 2)
  };
}

function renderProgress() {
  const progress = currentProgress();
  const dimensions = masteryScores(progress);
  const total = Math.round(Object.values(dimensions).reduce((sum, value) => sum + value, 0) / Object.keys(dimensions).length);
  const completed = [
    progress.concept,
    progress.prediction,
    progress.workshop,
    progress.debug,
    progress.quiz >= 80 && progress.explanation >= 60
  ].filter(Boolean).length;
  const allScores = pythonLessons.map((lesson) => {
    const item = state.lessons[lesson.id] || blankLessonProgress();
    return Object.values(masteryScores(item)).reduce((sum, value) => sum + value, 0) / 5;
  });
  const xp = Math.round(allScores.reduce((sum, value) => sum + value, 0) * 4);

  document.querySelector("#mastery-total").textContent = total;
  document.querySelector("#mastery-bars").innerHTML = Object.entries(dimensions).map(([label, score]) => `
    <div class="mastery-row"><span>${label}</span><div class="mastery-track"><i style="width:${score}%"></i></div><b>${score}</b></div>
  `).join("");
  document.querySelector("#mission-progress").style.width = `${completed * 20}%`;
  document.querySelector("#mission-status").textContent = `${completed} / 5 个检查点`;
  document.querySelector("#level-progress").style.width = `${Math.min(100, xp / 8)}%`;
  document.querySelector("#xp-label").textContent = `${xp} XP`;
  document.querySelector("#level-number").textContent = String(Math.max(1, Math.ceil(xp / 250))).padStart(2, "0");
  document.querySelector('[data-checkpoint="concept"]').checked = progress.concept;
  renderLessonSwitcher();
}

function showFeedback(element, html, positive = true) {
  element.innerHTML = html;
  element.classList.add("show");
  element.style.borderLeft = `3px solid ${positive ? "var(--green)" : "var(--coral)"}`;
}

function toast(message) {
  const node = document.querySelector("#toast");
  node.textContent = message;
  node.classList.add("show");
  setTimeout(() => node.classList.remove("show"), 2200);
}

function bindLessonInteractions() {
  const lesson = currentLesson();

  document.querySelector('[data-checkpoint="concept"]').onchange = (event) => {
    currentProgress().concept = event.target.checked;
    saveState();
    toast(event.target.checked ? "知识检查点已记录" : "检查点已取消");
  };

  document.querySelectorAll("#prediction-choices .choice").forEach((button) => {
    button.onclick = () => {
      const correct = button.dataset.answer === lesson.prediction.answer;
      document.querySelectorAll("#prediction-choices .choice").forEach((node) => {
        node.classList.toggle("correct", node.dataset.answer === lesson.prediction.answer);
        node.classList.remove("wrong");
      });
      if (!correct) button.classList.add("wrong");
      showFeedback(
        document.querySelector("#prediction-feedback"),
        `<b>${correct ? "判断正确。" : "这次不对，请写出每个中间值。"}</b><br>${lesson.prediction.explanation}`,
        correct
      );
      if (correct) {
        currentProgress().prediction = true;
        saveState();
      }
    };
  });

  document.querySelector("#run-workbench").onclick = runWorkbench;

  document.querySelectorAll("#debug-choices .choice").forEach((button) => {
    button.onclick = () => {
      const answer = Number(button.dataset.debugAnswer);
      const correct = answer === lesson.debugChallenge.answer;
      document.querySelectorAll("#debug-choices .choice").forEach((node) => {
        node.classList.toggle("correct", Number(node.dataset.debugAnswer) === lesson.debugChallenge.answer);
        node.classList.remove("wrong");
      });
      if (!correct) button.classList.add("wrong");
      showFeedback(
        document.querySelector("#debug-feedback"),
        `<b>${correct ? "诊断正确。" : "诊断不准确，再检查每个值的类型。"}</b><br>${lesson.debugChallenge.explanation}<br><code>${escapeHtml(lesson.debugChallenge.fix)}</code>`,
        correct
      );
      if (correct) {
        currentProgress().debug = true;
        saveState();
      }
    };
  });

  document.querySelector("#quiz-form").onsubmit = (event) => {
    event.preventDefault();
    let correct = 0;
    const explanations = [];
    const form = new FormData(event.currentTarget);
    lesson.quiz.forEach((quiz, index) => {
      if (Number(form.get(`quiz-${index}`)) === quiz.answer) correct += 1;
      else explanations.push(`第 ${index + 1} 题：${quiz.reason}`);
    });
    const score = Math.round((correct / lesson.quiz.length) * 100);
    currentProgress().quiz = score;
    saveState();
    showFeedback(
      document.querySelector("#quiz-result"),
      `<b>得分 ${score} / 100</b><br>${score === 100 ? "全部正确，可以进入解释挑战。" : explanations.join("<br>")}`,
      score >= 80
    );
  };

  document.querySelector("#evaluate-explanation").onclick = evaluateExplanation;
}

function runWorkbench() {
  const lesson = currentLesson();
  let output = "";
  let trace = "";

  if (lesson.lab.kind === "variables") {
    const name = document.querySelector("#name-input").value.trim() || "未命名探险家";
    const energy = Math.max(0, Math.min(100, Number(document.querySelector("#energy-input").value) || 0));
    const supply = Number(document.querySelector("#supply-input").value);
    const finalEnergy = Math.min(100, energy + supply);
    output = `${name} 出发！\n初始能量：${energy}\n获得补给：${supply}\n当前能量：${finalEnergy}`;
    trace = `
      <div class="trace-row"><span>name · str</span><b>"${escapeHtml(name)}"</b></div>
      <div class="trace-row"><span>energy · int</span><b>${energy} → ${finalEnergy}</b></div>
      <div class="trace-row"><span>supply · int</span><b>${supply}</b></div>
      <div class="trace-row"><span>计算规则</span><b>min(100, energy + supply)</b></div>
    `;
  } else {
    const price = Math.max(0, Number(document.querySelector("#price-input").value) || 0);
    const count = Math.max(1, Math.floor(Number(document.querySelector("#count-input").value) || 1));
    const coupon = Math.max(0, Number(document.querySelector("#coupon-input").value) || 0);
    const subtotal = price * count;
    const total = Math.max(0, subtotal - coupon);
    const freeShipping = total >= 50;
    output = `小计：${subtotal}\n优惠后：${total}\n免运费：${freeShipping ? "True" : "False"}`;
    trace = `
      <div class="trace-row"><span>第一步</span><b>${price} * ${count} = ${subtotal}</b></div>
      <div class="trace-row"><span>第二步</span><b>${subtotal} - ${coupon} = ${total}</b></div>
      <div class="trace-row"><span>比较表达式</span><b>${total} >= 50 → ${freeShipping}</b></div>
      <div class="trace-row"><span>结果类型</span><b>number, number, bool</b></div>
    `;
  }

  document.querySelector("#terminal-output").textContent = output;
  document.querySelector("#state-trace").innerHTML = trace;
  currentProgress().workshop = true;
  saveState();
  toast("实操检查点完成");
}

function evaluateExplanation() {
  const lesson = currentLesson();
  const answer = document.querySelector("#explanation-input").value.trim();
  const hits = lesson.evaluationGroups.filter((keywords) => keywords.some((word) => answer.includes(word)));
  const contentScore = Math.round((hits.length / lesson.evaluationGroups.length) * 80);
  const score = Math.min(100, contentScore + (answer.length >= 45 ? 20 : 0));
  const missing = lesson.evaluationGroups
    .filter((group) => !hits.includes(group))
    .map((group) => group[0]);
  currentProgress().explanation = score;
  saveState();
  showFeedback(
    document.querySelector("#explanation-feedback"),
    `<b>表达初评 ${score} / 100</b><br>${missing.length ? `还需要讲清：${missing.join("、")}。` : "关键链路完整。下一步应接受人工追问，验证是否能够迁移。"}<br><small>自动评分只做第一轮筛查，不替代框架考核。</small>`,
    score >= 60
  );
}

function bindGlobalInteractions() {
  document.querySelectorAll("[data-scroll]").forEach((button) => {
    button.addEventListener("click", () => document.querySelector(`#${button.dataset.scroll}`).scrollIntoView());
  });

  document.querySelector("#lesson-switcher").addEventListener("click", (event) => {
    const button = event.target.closest("[data-lesson]");
    if (!button) return;
    state.activeLessonId = button.dataset.lesson;
    saveState();
    renderLesson();
    document.querySelector("#concepts").scrollIntoView();
  });

  document.querySelector("#reset-progress").addEventListener("click", () => {
    if (!confirm("确定清除这台设备上的全部学习进度吗？")) return;
    localStorage.removeItem(storageKey);
    localStorage.removeItem(legacyStorageKey);
    state = {
      activeLessonId: pythonLessons[0].id,
      lessons: Object.fromEntries(pythonLessons.map((lesson) => [lesson.id, blankLessonProgress()]))
    };
    renderLesson();
    toast("全部本地进度已重置");
  });

  document.querySelectorAll(".track-link").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.track === "python") document.querySelector("#concepts").scrollIntoView();
      else {
        const track = tracks.find((item) => item.id === button.dataset.track);
        toast(`${track.title}正在开发，已规划 ${track.chapters.length} 个章节`);
      }
    });
  });
}

renderStaticContent();
bindGlobalInteractions();
renderLesson();
