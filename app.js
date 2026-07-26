import { assessmentLevels, lessonCatalog, tracks } from "./data/curriculum.js";
import { simulateExpedition } from "./lib/expedition.js";

const storageKey = "ai-explorer-progress-v2";
const legacyStorageKey = "ai-explorer-progress-v1";
const defaultTrackId = "python";
const allLessons = Object.values(lessonCatalog).flat();
const blankLessonProgress = () => ({
  concept: false,
  prediction: false,
  workshop: false,
  debug: false,
  quiz: 0,
  explanation: 0,
  project: false,
  code: false
});

let state = loadState();

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    if (stored?.lessons) {
      for (const lesson of allLessons) {
        stored.lessons[lesson.id] = { ...blankLessonProgress(), ...stored.lessons[lesson.id] };
      }
      const storedLesson = allLessons.find((lesson) => lesson.id === stored.activeLessonId);
      stored.activeTrackId = storedLesson?.trackId || defaultTrackId;
      return stored;
    }
  } catch {
    // 损坏的本地数据不应阻止课程启动。
  }

  const initial = {
    activeTrackId: defaultTrackId,
    activeLessonId: lessonCatalog[defaultTrackId][0].id,
    lessons: Object.fromEntries(allLessons.map((lesson) => [lesson.id, blankLessonProgress()]))
  };

  try {
    const legacy = JSON.parse(localStorage.getItem(legacyStorageKey));
    if (legacy) initial.lessons[lessonCatalog[defaultTrackId][0].id] = { ...blankLessonProgress(), ...legacy };
  } catch {
    // 旧进度迁移失败时使用全新进度。
  }
  return initial;
}

function currentLesson() {
  return allLessons.find((lesson) => lesson.id === state.activeLessonId) || lessonCatalog[defaultTrackId][0];
}

function currentTrackLessons() {
  return lessonCatalog[state.activeTrackId] || [];
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
    <button class="track-link ${track.id === state.activeTrackId ? "active" : ""}" data-track="${track.id}">
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
      <small>${track.available ? `${lessonCatalog[track.id]?.length || 0} 个关卡已开放` : `${track.chapters.length} 个关卡 · 待解锁`}</small>
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
  document.querySelector("#lesson-switcher").innerHTML = currentTrackLessons().map((lesson, index) => {
    const progress = state.lessons[lesson.id] || blankLessonProgress();
    const lessonPassed = progress.quiz >= 80 && progress.explanation >= 60 && progress.debug;
    const projectPassed = !lesson.moduleProject || progress.project;
    const codePassed = !lesson.codeChallenge || progress.code;
    const passed = lessonPassed && projectPassed && codePassed;
    return `
      <button class="${lesson.id === state.activeLessonId ? "active" : ""}" data-lesson="${lesson.id}">
        <span>${String(index + 1).padStart(2, "0")}</span>${passed ? "已通过" : "学习"}
      </button>
    `;
  }).join("");
}

function renderLesson() {
  const lesson = currentLesson();
  const track = tracks.find((item) => item.id === lesson.trackId);
  document.querySelector("#hero-track-label").textContent = `${track?.title || "学习区域"} · ${track?.source || ""}`;
  document.querySelector("#lesson-switcher").setAttribute("aria-label", `${track?.title || "当前区域"}关卡`);
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
  renderModuleProject(lesson);
  renderCodeChallenge(lesson);
  renderGraduation(lesson);

  bindLessonInteractions();
  renderLessonSwitcher();
  renderProgress();
}

function renderModuleProject(lesson) {
  const section = document.querySelector("#module-project");
  section.hidden = !lesson.moduleProject;
  if (!lesson.moduleProject) return;
  document.querySelector("#project-title").textContent = lesson.moduleProject.title;
  document.querySelector("#project-brief").textContent = lesson.moduleProject.brief;
  document.querySelector("#project-requirements").innerHTML = lesson.moduleProject.requirements
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.querySelector("#project-test-results").innerHTML = "";
}

function renderCodeChallenge(lesson) {
  const section = document.querySelector("#code-challenge");
  section.hidden = !lesson.codeChallenge;
  if (!lesson.codeChallenge) return;
  document.querySelector("#code-challenge-title").textContent = lesson.codeChallenge.title;
  document.querySelector("#code-challenge-brief").textContent = lesson.codeChallenge.brief;
  document.querySelector("#code-challenge-checks").innerHTML = lesson.codeChallenge.checks
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.querySelector("#learner-code").value = lesson.codeChallenge.starter;
  document.querySelector("#runner-status").textContent = "等待提交";
  document.querySelector("#code-results").innerHTML = "";
}

function renderGraduation(lesson) {
  const section = document.querySelector("#graduation-section");
  section.hidden = !lesson.graduation;
  if (!lesson.graduation) return;
  document.querySelector("#graduation-title").textContent = lesson.graduation.title;
  document.querySelector("#graduation-requirements").innerHTML = lesson.graduation.requirements
    .map((item) => `<li>${item}</li>`)
    .join("");
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

  if (kind === "expressions") {
    controls.innerHTML = `
      <label>物品单价 price<input id="price-input" type="number" value="19" min="0" max="999" /></label>
      <label>购买数量 count<input id="count-input" type="number" value="3" min="1" max="99" /></label>
      <label>优惠金额 coupon<input id="coupon-input" type="number" value="5" min="0" max="999" /></label>
      <button class="primary-button" id="run-workbench">计算表达式 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "conditions") {
    controls.innerHTML = `
      <label>当前能量 energy<input id="branch-energy-input" type="number" value="60" min="0" max="100" /></label>
      <label>天气 weather
        <select id="weather-input">
          <option value="sunny">晴天 sunny</option>
          <option value="rain" selected>下雨 rain</option>
          <option value="storm">暴风 storm</option>
        </select>
      </label>
      <label class="toggle-label"><input id="map-input" type="checkbox" checked /> 已携带地图 has_map</label>
      <button class="primary-button" id="run-workbench">判断行动路径 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "loops") {
    controls.innerHTML = `
      <label>初始能量 energy<input id="loop-energy-input" type="number" value="14" min="0" max="100" /></label>
      <label>每轮消耗 cost<input id="loop-cost-input" type="number" value="3" min="1" max="20" /></label>
      <label>最多轮数 limit<input id="loop-limit-input" type="number" value="10" min="1" max="30" /></label>
      <button class="primary-button" id="run-workbench">追踪循环 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "files") {
    controls.innerHTML = `
      <label>模拟 scores.txt 内容<textarea id="file-lines-input" rows="7">80\nbad\n\n60\n101</textarea></label>
      <label class="toggle-label"><input id="ignore-blank-input" type="checkbox" checked /> 忽略空行</label>
      <button class="primary-button" id="run-workbench">读取并解析 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "functions") {
    controls.innerHTML = `
      <label>函数实参 scores（逗号分隔）<input id="function-scores-input" value="70,80,50" /></label>
      <label>及格线 pass_line<input id="pass-line-input" type="number" value="60" min="0" max="100" /></label>
      <label class="toggle-label"><input id="round-average-input" type="checkbox" /> 平均值保留 1 位小数</label>
      <button class="primary-button" id="run-workbench">调用函数 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "oop") {
    controls.innerHTML = `
      <label>实例 A 初始能量<input id="oop-energy-a" type="number" value="80" min="0" max="100" /></label>
      <label>实例 B 初始能量<input id="oop-energy-b" type="number" value="50" min="0" max="100" /></label>
      <label>A 承受伤害<input id="oop-damage" type="number" value="20" min="0" max="100" /></label>
      <button class="primary-button" id="run-workbench">调用实例方法 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "modules") {
    controls.innerHTML = `
      <label>本地文件名<input id="module-file-input" value="random.py" /></label>
      <label>运行方式<select id="module-mode-input"><option value="import">被其他模块 import</option><option value="direct">直接运行</option></select></label>
      <label class="toggle-label"><input id="module-repeat-input" type="checkbox" checked /> 在同一进程导入两次</label>
      <button class="primary-button" id="run-workbench">追踪导入 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "advanced") {
    controls.innerHTML = `
      <label>内部列表初始值<input id="copy-values-input" value="1,2" /></label>
      <label>向浅拷贝内部追加<input id="copy-append-input" type="number" value="9" /></label>
      <label>消费生成器数量<input id="generator-count-input" type="number" value="3" min="1" max="10" /></label>
      <button class="primary-button" id="run-workbench">观察引用与惰性 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "concurrency") {
    controls.innerHTML = `
      <label>任务性质<select id="workload-input"><option value="io">IO 密集：等待网络</option><option value="cpu">CPU 密集：大量计算</option></select></label>
      <label>任务数量<input id="task-count-input" type="number" value="100" min="1" max="1000" /></label>
      <label class="toggle-label"><input id="shared-state-input" type="checkbox" /> 多任务修改共享状态</label>
      <button class="primary-button" id="run-workbench">选择并发模型 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "network") {
    controls.innerHTML = `
      <label>请求 URL<input id="url-input" value="https://api.example.com/items?q=map" /></label>
      <label>响应状态码<input id="status-input" type="number" value="200" min="100" max="599" /></label>
      <label>待匹配文本<input id="regex-text-input" value="item-42 and item-7" /></label>
      <button class="primary-button" id="run-workbench">分析请求与模式 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "architecture") {
    controls.innerHTML = `
      <label>当前改动<select id="change-input"><option value="rule">修改业务计算规则</option><option value="db">替换数据库</option><option value="cli">增加 Web 入口</option></select></label>
      <label class="toggle-label"><input id="tests-input" type="checkbox" checked /> 已有业务单元测试</label>
      <label class="toggle-label"><input id="injection-input" type="checkbox" checked /> 外部依赖通过接口注入</label>
      <button class="primary-button" id="run-workbench">分析影响范围 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "complexity") {
    controls.innerHTML = `
      <label>输入规模 n<input id="complexity-size-input" type="number" value="16" min="1" max="10000" /></label>
      <label>增长模型
        <select id="complexity-model-input">
          <option value="constant">O(1) 常数</option>
          <option value="logarithmic">O(log n) 对数</option>
          <option value="linear" selected>O(n) 线性</option>
          <option value="nlogn">O(n log n)</option>
          <option value="quadratic">O(n²) 平方</option>
        </select>
      </label>
      <label class="toggle-label"><input id="complexity-compare-input" type="checkbox" checked /> 同时比较全部增长模型</label>
      <button class="primary-button" id="run-workbench">统计基本操作 <span>▶</span></button>
    `;
    return;
  }

  controls.innerHTML = `
    <label>物品文本（逗号分隔）<input id="items-input" value="torch,map,torch,rope" /></label>
    <label>查找目标 target<input id="target-input" value="torch" maxlength="20" /></label>
    <label class="toggle-label"><input id="clean-input" type="checkbox" checked /> 去除首尾空格并忽略空项</label>
    <button class="primary-button" id="run-workbench">构建容器 <span>▶</span></button>
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
  const checkpointStates = [
    progress.concept,
    progress.prediction,
    progress.workshop,
    progress.debug,
    progress.quiz >= 80 && progress.explanation >= 60
  ];
  if (currentLesson().moduleProject) checkpointStates.push(progress.project);
  if (currentLesson().codeChallenge) checkpointStates.push(progress.code);
  const completed = checkpointStates.filter(Boolean).length;
  const checkpointTotal = checkpointStates.length;
  const allScores = allLessons.map((lesson) => {
    const item = state.lessons[lesson.id] || blankLessonProgress();
    return Object.values(masteryScores(item)).reduce((sum, value) => sum + value, 0) / 5;
  });
  const xp = Math.round(allScores.reduce((sum, value) => sum + value, 0) * 4);

  document.querySelector("#mastery-total").textContent = total;
  document.querySelector("#mastery-bars").innerHTML = Object.entries(dimensions).map(([label, score]) => `
    <div class="mastery-row"><span>${label}</span><div class="mastery-track"><i style="width:${score}%"></i></div><b>${score}</b></div>
  `).join("");
  document.querySelector("#mission-progress").style.width = `${(completed / checkpointTotal) * 100}%`;
  document.querySelector("#mission-status").textContent = `${completed} / ${checkpointTotal} 个检查点`;
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
        `<b>${correct ? "诊断正确。" : "诊断不准确，请先追踪错误或错误结果。"}</b>
        <span class="debug-label">原始错误 / 错误现象</span>
        <code>${escapeHtml(lesson.debugChallenge.error)}</code>
        <span class="debug-label">根因</span>
        <span>${lesson.debugChallenge.explanation}</span>
        <span class="debug-label">修复代码</span>
        <code>${escapeHtml(lesson.debugChallenge.fix)}</code>
        <span class="debug-label">执行结果</span>
        <code>${escapeHtml(lesson.debugChallenge.result)}</code>`,
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
  const projectButton = document.querySelector("#run-project-tests");
  if (lesson.moduleProject) projectButton.onclick = runProjectTests;
  const codeButton = document.querySelector("#submit-code");
  if (lesson.codeChallenge) codeButton.onclick = submitLearnerCode;
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
  } else if (lesson.lab.kind === "expressions") {
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
  } else if (lesson.lab.kind === "conditions") {
    const energy = Math.max(0, Math.min(100, Number(document.querySelector("#branch-energy-input").value) || 0));
    const weather = document.querySelector("#weather-input").value;
    const hasMap = document.querySelector("#map-input").checked;
    const canExpedition = energy >= 80 && weather === "sunny" && hasMap;
    const canTrain = energy >= 50 && weather !== "storm";
    let action = "休息";
    let path = "else";
    if (canExpedition) {
      action = "远征";
      path = "if";
    } else if (canTrain) {
      action = "训练";
      path = "elif";
    }
    output = `行动：${action}\n命中路径：${path}\n最终状态：${action === "休息" ? "恢复能量" : "消耗能量"}`;
    trace = `
      <div class="trace-row"><span>if 条件</span><b>${energy} >= 80 and ${weather} == sunny and ${hasMap} → ${canExpedition}</b></div>
      <div class="trace-row"><span>elif 条件</span><b>${energy} >= 50 and ${weather} != storm → ${canTrain}</b></div>
      <div class="trace-row"><span>命中分支</span><b>${path} → ${action}</b></div>
      <div class="trace-row"><span>路径规则</span><b>命中后不再检查后续分支</b></div>
    `;
  } else if (lesson.lab.kind === "loops") {
    const initialEnergy = Math.max(0, Number(document.querySelector("#loop-energy-input").value) || 0);
    const cost = Math.max(1, Number(document.querySelector("#loop-cost-input").value) || 1);
    const limit = Math.max(1, Math.floor(Number(document.querySelector("#loop-limit-input").value) || 1));
    let energy = initialEnergy;
    let round = 0;
    const rows = [];
    while (energy >= cost && round < limit) {
      const before = energy;
      round += 1;
      energy -= cost;
      rows.push(`<div class="trace-row"><span>第 ${round} 轮</span><b>${before} - ${cost} = ${energy}</b></div>`);
    }
    const reason = round >= limit && energy >= cost ? "达到安全轮数上限" : "剩余能量不足";
    output = `完成轮数：${round}\n剩余能量：${energy}\n终止原因：${reason}`;
    trace = `${rows.join("")}
      <div class="trace-row"><span>不变量</span><b>${round} × ${cost} + ${energy} = ${initialEnergy}</b></div>
      <div class="trace-row"><span>终止证明</span><b>energy 每轮减少且有下界 0</b></div>
    `;
  } else if (lesson.lab.kind === "files") {
    const lines = document.querySelector("#file-lines-input").value.split(/\r?\n/);
    const ignoreBlank = document.querySelector("#ignore-blank-input").checked;
    const scores = [];
    const errors = [];
    const rows = [];
    lines.forEach((line, index) => {
      const text = line.trim();
      if (!text && ignoreBlank) {
        rows.push(`<div class="trace-row"><span>第 ${index + 1} 行</span><b>空行 → 忽略</b></div>`);
        return;
      }
      const value = Number(text);
      if (!text || !Number.isFinite(value)) {
        errors.push({ line: index + 1, text, reason: "无法转换为数字" });
        rows.push(`<div class="trace-row"><span>第 ${index + 1} 行</span><b>${escapeHtml(text || "(空)")} → ValueError</b></div>`);
      } else if (value < 0 || value > 100) {
        errors.push({ line: index + 1, text, reason: "超出 0–100" });
        rows.push(`<div class="trace-row"><span>第 ${index + 1} 行</span><b>${value} → 范围无效</b></div>`);
      } else {
        scores.push(value);
        rows.push(`<div class="trace-row"><span>第 ${index + 1} 行</span><b>${value} → scores.append</b></div>`);
      }
    });
    output = `有效分数：${JSON.stringify(scores)}\n无效行数：${errors.length}\n错误证据：${JSON.stringify(errors)}`;
    trace = `${rows.join("")}
      <div class="trace-row"><span>流水线</span><b>读取 ${lines.length} → 解析 → 验证 → 汇总</b></div>
    `;
  } else if (lesson.lab.kind === "collections") {
    const raw = document.querySelector("#items-input").value;
    const target = document.querySelector("#target-input").value.trim();
    const clean = document.querySelector("#clean-input").checked;
    const pieces = raw.split(",");
    const items = clean ? pieces.map((item) => item.trim()).filter(Boolean) : pieces;
    const counts = {};
    for (const item of items) counts[item] = (counts[item] || 0) + 1;
    const targetCount = counts[target] || 0;
    output = `列表：${JSON.stringify(items)}\n字典：${JSON.stringify(counts)}\n${target} 出现：${targetCount} 次`;
    trace = `
      <div class="trace-row"><span>原始值</span><b>str · ${escapeHtml(raw)}</b></div>
      <div class="trace-row"><span>split 结果</span><b>list · ${escapeHtml(JSON.stringify(items))}</b></div>
      <div class="trace-row"><span>汇总结果</span><b>dict · ${escapeHtml(JSON.stringify(counts))}</b></div>
      <div class="trace-row"><span>按键查找</span><b>counts.get("${escapeHtml(target)}", 0) → ${targetCount}</b></div>
    `;
  } else if (lesson.lab.kind === "functions") {
    const raw = document.querySelector("#function-scores-input").value;
    const scores = raw.split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isFinite(item));
    const passLine = Number(document.querySelector("#pass-line-input").value) || 0;
    const shouldRound = document.querySelector("#round-average-input").checked;
    const total = scores.reduce((sum, score) => sum + score, 0);
    const rawAverage = scores.length ? total / scores.length : 0;
    const average = shouldRound ? Math.round(rawAverage * 10) / 10 : rawAverage;
    const passed = scores.length > 0 && average >= passLine;
    output = `返回值：${JSON.stringify({ total, average, passed })}`;
    trace = `
      <div class="trace-row"><span>实参进入</span><b>scores = ${escapeHtml(JSON.stringify(scores))}</b></div>
      <div class="trace-row"><span>局部计算</span><b>total = ${total}；average = ${average}</b></div>
      <div class="trace-row"><span>条件判断</span><b>${average} >= ${passLine} → ${passed}</b></div>
      <div class="trace-row"><span>return</span><b>字典离开函数，局部变量结束</b></div>
    `;
  } else if (lesson.lab.kind === "oop") {
    const energyA = Math.max(0, Number(document.querySelector("#oop-energy-a").value) || 0);
    const energyB = Math.max(0, Number(document.querySelector("#oop-energy-b").value) || 0);
    const damage = Math.max(0, Number(document.querySelector("#oop-damage").value) || 0);
    const afterA = Math.max(0, energyA - damage);
    output = `Explorer A.energy = ${afterA}\nExplorer B.energy = ${energyB}\n类属性 team = "AI"（两者共享）`;
    trace = `
      <div class="trace-row"><span>创建 A</span><b>__init__(${energyA}) → self.energy = ${energyA}</b></div>
      <div class="trace-row"><span>创建 B</span><b>__init__(${energyB}) → self.energy = ${energyB}</b></div>
      <div class="trace-row"><span>A.take_damage</span><b>${energyA} - ${damage} → ${afterA}</b></div>
      <div class="trace-row"><span>隔离证据</span><b>B.energy 仍为 ${energyB}</b></div>
    `;
  } else if (lesson.lab.kind === "modules") {
    const filename = document.querySelector("#module-file-input").value.trim();
    const mode = document.querySelector("#module-mode-input").value;
    const repeat = document.querySelector("#module-repeat-input").checked;
    const shadows = ["random.py", "json.py", "typing.py", "socket.py"].includes(filename.toLowerCase());
    output = `模块名：${filename.replace(/\.py$/i, "")}\n__name__：${mode === "direct" ? "__main__" : filename.replace(/\.py$/i, "")}\n${shadows ? "警告：可能遮蔽标准库同名模块" : "名称未命中常见标准库冲突"}\n顶层执行次数：${repeat ? 1 : 1}`;
    trace = `
      <div class="trace-row"><span>首次加载</span><b>查找路径 → 执行顶层 → 写入 sys.modules</b></div>
      <div class="trace-row"><span>再次导入</span><b>${repeat ? "命中缓存，不重复执行" : "未进行第二次导入"}</b></div>
      <div class="trace-row"><span>入口保护</span><b>${mode === "direct" ? "执行 main 入口" : "跳过 main 入口"}</b></div>
      <div class="trace-row"><span>命名风险</span><b>${shadows ? "高：请重命名本地文件" : "未发现常见冲突"}</b></div>
    `;
  } else if (lesson.lab.kind === "advanced") {
    const values = document.querySelector("#copy-values-input").value.split(",").map((item) => Number(item.trim())).filter(Number.isFinite);
    const appended = Number(document.querySelector("#copy-append-input").value) || 0;
    const consumed = Math.max(1, Math.floor(Number(document.querySelector("#generator-count-input").value) || 1));
    const sharedInner = [...values, appended];
    const generated = Array.from({ length: consumed }, (_, index) => index * index);
    output = `浅拷贝后原对象内部：${JSON.stringify(sharedInner)}\n生成器本次消费：${JSON.stringify(generated)}\n下一位置：${consumed}`;
    trace = `
      <div class="trace-row"><span>浅拷贝</span><b>新外层容器，内部列表引用仍共享</b></div>
      <div class="trace-row"><span>内部追加</span><b>${appended} 对两边都可见</b></div>
      <div class="trace-row"><span>生成器</span><b>逐项产生 ${consumed} 个值，不预建无限序列</b></div>
      <div class="trace-row"><span>状态保存</span><b>yield 后暂停在索引 ${consumed}</b></div>
    `;
  } else if (lesson.lab.kind === "concurrency") {
    const workload = document.querySelector("#workload-input").value;
    const taskCount = Math.max(1, Number(document.querySelector("#task-count-input").value) || 1);
    const shared = document.querySelector("#shared-state-input").checked;
    const model = workload === "cpu" ? "多进程 multiprocessing" : taskCount > 30 ? "asyncio 协程" : "线程池或 asyncio";
    output = `推荐模型：${model}\n任务数量：${taskCount}\n同步策略：${shared ? "锁或单一消费者队列" : "不可变结果汇总"}`;
    trace = `
      <div class="trace-row"><span>任务性质</span><b>${workload === "cpu" ? "CPU 密集" : "IO 密集"}</b></div>
      <div class="trace-row"><span>GIL 影响</span><b>${workload === "cpu" ? "纯 Python 多线程难以多核并行" : "等待 IO 时可切换其他任务"}</b></div>
      <div class="trace-row"><span>共享状态</span><b>${shared ? "存在竞态风险，需要明确所有权" : "无共享写入，协调更简单"}</b></div>
      <div class="trace-row"><span>结论</span><b>${model}</b></div>
    `;
  } else if (lesson.lab.kind === "network") {
    const urlText = document.querySelector("#url-input").value.trim();
    const status = Number(document.querySelector("#status-input").value) || 0;
    const text = document.querySelector("#regex-text-input").value;
    let parsed;
    try { parsed = new URL(urlText); } catch { parsed = null; }
    const matches = [...text.matchAll(/item-(\d+)/g)].map((match) => Number(match[1]));
    output = `URL：${parsed ? "有效" : "无效"}\nHTTP：${status >= 200 && status < 300 ? "协议成功" : "需要错误处理"}\n正则匹配 ID：${JSON.stringify(matches)}`;
    trace = `
      <div class="trace-row"><span>连接目标</span><b>${parsed ? `${parsed.hostname}:${parsed.port || 443}` : "无法解析"}</b></div>
      <div class="trace-row"><span>请求路径</span><b>${parsed ? parsed.pathname + parsed.search : "无"}</b></div>
      <div class="trace-row"><span>响应状态</span><b>${status} → ${status >= 200 && status < 300 ? "继续验证正文" : "进入协议错误分支"}</b></div>
      <div class="trace-row"><span>模式结果</span><b>r"item-(\\d+)" → ${matches.length} 项</b></div>
    `;
  } else if (lesson.lab.kind === "complexity") {
    const n = Math.max(1, Math.min(10000, Math.floor(Number(document.querySelector("#complexity-size-input").value) || 1)));
    const selected = document.querySelector("#complexity-model-input").value;
    const compareAll = document.querySelector("#complexity-compare-input").checked;
    const models = {
      constant: { label: "O(1)", count: () => 1 },
      logarithmic: { label: "O(log n)", count: (size) => Math.ceil(Math.log2(Math.max(1, size))) },
      linear: { label: "O(n)", count: (size) => size },
      nlogn: { label: "O(n log n)", count: (size) => Math.ceil(size * Math.log2(Math.max(1, size))) },
      quadratic: { label: "O(n²)", count: (size) => size * size }
    };
    const chosen = models[selected];
    const currentCount = chosen.count(n);
    const doubledCount = chosen.count(n * 2);
    const keys = compareAll ? Object.keys(models) : [selected];
    const largest = Math.max(...keys.map((key) => models[key].count(n)));
    output = `模型：${chosen.label}\nn = ${n}：约 ${currentCount} 次基本操作\nn = ${n * 2}：约 ${doubledCount} 次\n规模翻倍，操作量约为 ${(doubledCount / currentCount).toFixed(2)} 倍`;
    trace = keys.map((key) => {
      const model = models[key];
      const count = model.count(n);
      const width = Math.max(3, Math.round((count / largest) * 100));
      return `<div class="trace-row"><span>${model.label}</span><b>${count} 次 · ${width}% 相对长度</b></div>`;
    }).join("");
    trace += `<div class="trace-row"><span>分析口径</span><b>用基本操作近似最坏情况；不是实际毫秒数</b></div>`;
  } else {
    const change = document.querySelector("#change-input").value;
    const tested = document.querySelector("#tests-input").checked;
    const injected = document.querySelector("#injection-input").checked;
    const target = { rule: "领域/业务服务", db: "仓储适配器", cli: "新增入口适配器" }[change];
    output = `主要修改边界：${target}\n业务回归保护：${tested ? "已有" : "缺失"}\n外部依赖可替换：${injected ? "是" : "否"}`;
    trace = `
      <div class="trace-row"><span>变化原因</span><b>${target}</b></div>
      <div class="trace-row"><span>依赖方向</span><b>${injected ? "入口/适配器依赖业务接口" : "业务直接耦合外部实现，需重构"}</b></div>
      <div class="trace-row"><span>测试证据</span><b>${tested ? "先运行单元测试，再补适配器集成测试" : "先建立当前行为测试，避免盲改"}</b></div>
      <div class="trace-row"><span>影响控制</span><b>只让一个边界因该原因变化</b></div>
    `;
  }

  document.querySelector("#terminal-output").textContent = output;
  document.querySelector("#state-trace").innerHTML = trace;
  currentProgress().workshop = true;
  saveState();
  toast("实操检查点完成");
}

function runProjectTests() {
  const cases = [
    { name: "正常路径", input: [14, 3, "sunny"], expected: { rounds: 4, energy: 2 } },
    { name: "边界路径", input: [9, 3, "sunny"], expected: { rounds: 3, energy: 0 } },
    { name: "异常路径", input: [10, 0, "sunny"], expectedError: true },
    { name: "暴风加耗", input: [15, 3, "storm"], expected: { rounds: 3, energy: 0 } }
  ];
  const results = cases.map((item) => {
    const result = simulateExpedition(...item.input);
    const passed = item.expectedError
      ? !result.ok
      : result.ok && result.rounds === item.expected.rounds && result.energy === item.expected.energy;
    return { ...item, result, passed };
  });
  const allPassed = results.every((item) => item.passed);
  document.querySelector("#project-test-results").innerHTML = results.map((item) => `
    <div class="project-test ${item.passed ? "passed" : "failed"}">
      <span>${item.passed ? "✓" : "×"}</span>
      <div><b>${item.name}</b><small>${item.result.ok ? `${item.result.rounds} 轮，剩余 ${item.result.energy}` : item.result.reason}</small></div>
    </div>
  `).join("");
  if (allPassed) {
    currentProgress().project = true;
    saveState();
    toast("L2 模块项目验收通过");
  }
}

async function submitLearnerCode() {
  const lesson = currentLesson();
  if (!lesson.codeChallenge) return;
  const button = document.querySelector("#submit-code");
  const status = document.querySelector("#runner-status");
  const resultsNode = document.querySelector("#code-results");
  button.disabled = true;
  status.textContent = "正在进行安全检查和测试…";
  resultsNode.innerHTML = "";

  try {
    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        challengeId: lesson.codeChallenge.id,
        code: document.querySelector("#learner-code").value
      })
    });
    const result = await response.json();
    status.textContent = result.message || (result.ok ? "通过" : "未通过");
    if (result.results) {
      resultsNode.innerHTML = result.results.map((item) => `
        <div class="project-test ${item.passed ? "passed" : "failed"}">
          <span>${item.passed ? "✓" : "×"}</span>
          <div>
            <b>${item.name}</b>
            <small>${item.actual === null ? "结果已隐藏" : `得到 ${escapeHtml(JSON.stringify(item.actual))}，期望 ${escapeHtml(JSON.stringify(item.expected))}`}</small>
          </div>
        </div>
      `).join("");
    } else {
      resultsNode.innerHTML = `<div class="runner-error">${escapeHtml(result.message || "验收失败")}</div>`;
    }
    if (result.ok) {
      currentProgress().code = true;
      saveState();
      toast("真实代码验收通过");
    }
  } catch {
    status.textContent = "无法连接本地验收服务";
    resultsNode.innerHTML = '<div class="runner-error">请确认使用 npm run dev 启动项目，而不是直接打开 HTML 文件。</div>';
  } finally {
    button.disabled = false;
  }
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
    `<b>表达初评 ${score} / 100</b>
    <span>${missing.length ? `你的回答还需要讲清：${missing.join("、")}。` : "你的关键推理链已经完整。下一步应接受人工追问，验证是否能够迁移。"}</span>
    <span class="debug-label">参考答案（不是唯一表述）</span>
    <span>${lesson.referenceAnswer}</span>
    <span class="debug-label">下一步</span>
    <span>对比你的回答与参考答案，用自己的话重新讲一次；不要直接背诵原文。</span>
    <small>自动评分只做第一轮筛查，不替代框架考核。</small>`,
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
      activeTrackId: defaultTrackId,
      activeLessonId: lessonCatalog[defaultTrackId][0].id,
      lessons: Object.fromEntries(allLessons.map((lesson) => [lesson.id, blankLessonProgress()]))
    };
    renderLesson();
    toast("全部本地进度已重置");
  });

  document.querySelectorAll(".track-link").forEach((button) => {
    button.addEventListener("click", () => {
      const lessons = lessonCatalog[button.dataset.track];
      if (lessons?.length) {
        state.activeTrackId = button.dataset.track;
        state.activeLessonId = lessons[0].id;
        document.querySelectorAll(".track-link").forEach((item) => {
          item.classList.toggle("active", item.dataset.track === state.activeTrackId);
        });
        saveState();
        renderLesson();
        document.querySelector("#concepts").scrollIntoView();
      } else {
        const track = tracks.find((item) => item.id === button.dataset.track);
        toast(`${track.title}正在开发，已规划 ${track.chapters.length} 个章节`);
      }
    });
  });
}

renderStaticContent();
bindGlobalInteractions();
renderLesson();
