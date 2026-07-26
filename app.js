import { assessmentLevels, lessonCatalog, tracks } from "./data/curriculum.js";
import { simulateExpedition } from "./lib/expedition.js";
import {
  blankLessonProgress,
  graduationReadiness,
  lessonCheckpoints,
  lessonLearningState,
  missingCheckpointLabels
} from "./lib/progress.js";

const storageKey = "ai-explorer-progress-v2";
const legacyStorageKey = "ai-explorer-progress-v1";
const defaultTrackId = "python";
const allLessons = Object.values(lessonCatalog).flat();
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
    const learningState = lessonLearningState(lesson, progress);
    const statusLabel = {
      not_started: "待学习",
      in_progress: "进行中",
      passed: "已通过"
    }[learningState];
    const shortTitle = lesson.title.replace(/^.*? · /, "");
    const missing = missingCheckpointLabels(lesson, progress);
    return `
      <button
        class="${lesson.id === state.activeLessonId ? "active" : ""} ${learningState}"
        data-lesson="${lesson.id}"
        title="${escapeHtml(missing.length ? `尚缺：${missing.join("、")}` : "本关全部检查点已完成")}"
      >
        <span class="lesson-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="lesson-switch-title">${escapeHtml(shortTitle)}</span>
        <small>${statusLabel}${missing.length ? ` · 缺 ${missing.length} 项` : ""}</small>
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
  const readiness = graduationReadiness(currentTrackLessons(), state.lessons, lesson.id);
  section.classList.toggle("locked", !readiness.unlocked);
  document.querySelector("#graduation-title").textContent = readiness.unlocked
    ? `${lesson.graduation.title} · 已解锁`
    : `${lesson.graduation.title} · 未解锁`;
  document.querySelector("#graduation-requirements").innerHTML = lesson.graduation.requirements
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.querySelector("#graduation-note").textContent = readiness.unlocked
    ? "前置关卡已全部通过。此考核仍须结合代码仓库、自动测试和人工追问完成，页面自评不能直接点亮毕业状态。"
    : `还需通过前面的 ${readiness.missingLessons.length} 个关卡才能解锁正式考核。要求可提前预览，但当前不能视为已毕业。`;
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

  if (kind === "dynamic-array") {
    controls.innerHTML = `
      <label>有效元素（逗号分隔）<input id="array-items-input" value="map,torch,rope" /></label>
      <label>当前底层容量 capacity<input id="array-capacity-input" type="number" value="4" min="1" max="32" /></label>
      <label>操作
        <select id="array-operation-input">
          <option value="append">尾部追加 append</option>
          <option value="insert" selected>指定位置插入 insert</option>
        </select>
      </label>
      <label>新元素 value<input id="array-value-input" value="water" maxlength="30" /></label>
      <label>插入索引 index<input id="array-index-input" type="number" value="1" min="0" max="30" /></label>
      <button class="primary-button" id="run-workbench">执行动态数组操作 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "linked-list") {
    controls.innerHTML = `
      <label>节点值（逗号分隔）<input id="linked-values-input" value="A,B,C,D" /></label>
      <label>指针操作
        <select id="linked-operation-input">
          <option value="insert">在指定节点后插入</option>
          <option value="delete">删除指定位置节点</option>
          <option value="reverse" selected>反转整条链</option>
          <option value="cycle">尾节点成环并检测</option>
        </select>
      </label>
      <label>位置 index<input id="linked-index-input" type="number" value="1" min="0" max="30" /></label>
      <label>新节点值（插入时使用）<input id="linked-new-value-input" value="X" maxlength="30" /></label>
      <button class="primary-button" id="run-workbench">执行指针改线 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "algorithm-studio") {
    const lab = currentLesson().lab;
    controls.innerHTML = `
      <label>实验输入<input id="algorithm-studio-input" value="${escapeHtml(lab.defaultInput)}" /></label>
      <label>目标 / 参数<input id="algorithm-studio-target" value="${escapeHtml(lab.defaultTarget)}" /></label>
      <label>实验模式
        <select id="algorithm-studio-mode">
          ${lab.modes.map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join("")}
        </select>
      </label>
      <button class="primary-button" id="run-workbench">运行算法并追踪状态 <span>▶</span></button>
    `;
    return;
  }

  if (kind === "relational-model") {
    controls.innerHTML = `
      <label>表名<input id="relation-table-input" value="learners" maxlength="30" /></label>
      <label>列定义（名称:类型，! 表示非空）<input id="relation-columns-input" value="id:BIGINT!,name:VARCHAR!,score:INT" /></label>
      <label>主键列<input id="relation-primary-key-input" value="id" maxlength="30" /></label>
      <label>样例行（每行一条，逗号分隔）<textarea id="relation-rows-input" rows="5">1,小码,88
2,小智,95
2,小新,</textarea></label>
      <button class="primary-button" id="run-workbench">检查关系模式 <span>▶</span></button>
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
  const lesson = currentLesson();
  const dimensions = masteryScores(progress);
  const total = Math.round(Object.values(dimensions).reduce((sum, value) => sum + value, 0) / Object.keys(dimensions).length);
  const checkpoints = lessonCheckpoints(lesson, progress);
  const completed = checkpoints.filter((checkpoint) => checkpoint.passed).length;
  const checkpointTotal = checkpoints.length;
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
  if (lesson.graduation) renderGraduation(lesson);
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
  } else if (lesson.lab.kind === "dynamic-array") {
    const items = document.querySelector("#array-items-input").value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const requestedCapacity = Math.max(1, Math.min(32, Math.floor(Number(document.querySelector("#array-capacity-input").value) || 1)));
    const capacity = Math.max(requestedCapacity, items.length);
    const operation = document.querySelector("#array-operation-input").value;
    const value = document.querySelector("#array-value-input").value.trim() || "new-item";
    const requestedIndex = Math.floor(Number(document.querySelector("#array-index-input").value) || 0);
    const index = operation === "append" ? items.length : Math.max(0, Math.min(items.length, requestedIndex));
    const expanded = items.length === capacity;
    const nextCapacity = expanded ? Math.max(1, capacity * 2) : capacity;
    const resizeCopies = expanded ? items.length : 0;
    const shifts = items.length - index;
    const before = [...items];
    items.splice(index, 0, value);
    const slots = [...items, ...Array(nextCapacity - items.length).fill("∅")];
    output = `操作前：size=${before.length}, capacity=${capacity}\n操作后：size=${items.length}, capacity=${nextCapacity}\n扩容复制：${resizeCopies} 次\n插入搬移：${shifts} 次\n有效元素：${JSON.stringify(items)}`;
    trace = `
      <div class="trace-row"><span>操作前有效区</span><b>${escapeHtml(JSON.stringify(before))}</b></div>
      <div class="trace-row"><span>容量检查</span><b>${before.length} ${expanded ? "==" : "<"} ${capacity} → ${expanded ? `扩容到 ${nextCapacity}` : "复用空闲槽位"}</b></div>
      <div class="trace-row"><span>扩容成本</span><b>复制 ${resizeCopies} 个已有引用</b></div>
      <div class="trace-row"><span>插入方向</span><b>索引 ${index} 后方 ${shifts} 项从后向前搬移</b></div>
      <div class="trace-row"><span>底层槽位</span><b>${escapeHtml(JSON.stringify(slots))}</b></div>
      <div class="trace-row"><span>复杂度结论</span><b>${operation === "append" && !expanded ? "本次 O(1)" : "本次 O(n)"}；连续 append 为摊还 O(1)</b></div>
    `;
  } else if (lesson.lab.kind === "linked-list") {
    const values = document.querySelector("#linked-values-input").value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 20);
    const operation = document.querySelector("#linked-operation-input").value;
    const requestedIndex = Math.floor(Number(document.querySelector("#linked-index-input").value) || 0);
    const newValue = document.querySelector("#linked-new-value-input").value.trim() || "X";
    const nodes = values.map((value, index) => ({
      id: index,
      value,
      next: index + 1 < values.length ? index + 1 : -1,
      removed: false
    }));
    let head = nodes.length ? 0 : -1;
    let tail = nodes.length ? nodes.length - 1 : -1;
    const steps = [];
    let detectedCycle = false;

    if (operation === "insert") {
      if (head === -1) {
        nodes.push({ id: 0, value: newValue, next: -1, removed: false });
        head = 0;
        tail = 0;
        steps.push("空链：head 和 tail 同时指向新节点 n0");
      } else {
        const index = Math.max(0, Math.min(nodes.length - 1, requestedIndex));
        const oldNext = nodes[index].next;
        const newId = nodes.length;
        nodes.push({ id: newId, value: newValue, next: oldNext, removed: false });
        nodes[index].next = newId;
        if (tail === index) tail = newId;
        steps.push(`先保存 n${index}.next = ${oldNext === -1 ? "None" : `n${oldNext}`}`);
        steps.push(`令 n${newId}.next 指向旧后继，再令 n${index}.next 指向 n${newId}`);
      }
    } else if (operation === "delete" && head !== -1) {
      const index = Math.max(0, Math.min(nodes.length - 1, requestedIndex));
      if (index === head) {
        head = nodes[index].next;
        if (tail === index) tail = head;
        steps.push(`删除 head：先把 head 推进到 ${head === -1 ? "None" : `n${head}`}`);
      } else {
        let previous = head;
        while (previous !== -1 && nodes[previous].next !== index) previous = nodes[previous].next;
        if (previous !== -1) {
          nodes[previous].next = nodes[index].next;
          if (tail === index) tail = previous;
          steps.push(`找到前驱 n${previous}，令它越过 n${index} 指向 ${nodes[index].next === -1 ? "None" : `n${nodes[index].next}`}`);
        }
      }
      nodes[index].removed = true;
      nodes[index].next = -1;
    } else if (operation === "reverse") {
      const oldHead = head;
      let previous = -1;
      let current = head;
      while (current !== -1) {
        const nextNode = nodes[current].next;
        nodes[current].next = previous;
        steps.push(`保存 ${nextNode === -1 ? "None" : `n${nextNode}`}；n${current}.next → ${previous === -1 ? "None" : `n${previous}`}`);
        previous = current;
        current = nextNode;
      }
      head = previous;
      tail = oldHead;
    } else if (operation === "cycle" && tail !== -1) {
      const target = Math.max(0, Math.min(nodes.length - 1, requestedIndex));
      nodes[tail].next = target;
      steps.push(`令 tail n${tail}.next → n${target}，链不再以 None 结束`);
      let slow = head;
      let fast = head;
      for (let round = 1; round <= nodes.length + 1 && fast !== -1 && nodes[fast].next !== -1; round += 1) {
        slow = nodes[slow].next;
        fast = nodes[nodes[fast].next].next;
        steps.push(`第 ${round} 轮：slow=${slow === -1 ? "None" : `n${slow}`}，fast=${fast === -1 ? "None" : `n${fast}`}`);
        if (slow === fast) {
          detectedCycle = true;
          break;
        }
      }
    }

    const order = [];
    const seen = new Set();
    let cursor = head;
    while (cursor !== -1 && !seen.has(cursor)) {
      seen.add(cursor);
      order.push(cursor);
      cursor = nodes[cursor].next;
    }
    const diagram = order.map((id) => `n${id}(${nodes[id].value})`).join(" → ")
      + (cursor === -1 ? " → None" : ` → n${cursor} ↺`);
    const activeCount = nodes.filter((node) => !node.removed).length;
    output = `head=${head === -1 ? "None" : `n${head}`}, tail=${tail === -1 ? "None" : `n${tail}`}\n${diagram || "空链 None"}\n可达节点：${order.length}；有效节点：${activeCount}\n${operation === "cycle" ? `检测结果：${detectedCycle ? "存在环" : "未发现环"}` : "结构：无环单链表"}`;
    trace = `${steps.map((step, index) => `<div class="trace-row"><span>步骤 ${index + 1}</span><b>${escapeHtml(step)}</b></div>`).join("")}
      <div class="trace-row"><span>节点身份</span><b>${escapeHtml(nodes.filter((node) => !node.removed).map((node) => `n${node.id}:${node.value}`).join("；") || "无")}</b></div>
      <div class="trace-row"><span>不变量检查</span><b>${operation === "cycle" ? "故意破坏 tail.next=None，用快慢指针取证" : `size=${activeCount}，从 head 可达 ${order.length} 个节点`}</b></div>
      <div class="trace-row"><span>复杂度</span><b>${operation === "insert" ? "已知节点后插入 O(1)；按索引定位仍为 O(n)" : "本操作需要遍历，O(n) 时间"}</b></div>
    `;
  } else if (lesson.lab.kind === "algorithm-studio") {
    const raw = document.querySelector("#algorithm-studio-input").value.trim();
    const targetText = document.querySelector("#algorithm-studio-target").value.trim();
    const mode = document.querySelector("#algorithm-studio-mode").value;
    const scenario = lesson.lab.scenario;
    const tokens = raw.split(",").map((item) => item.trim()).filter(Boolean);
    const numbers = tokens.map(Number).filter(Number.isFinite);
    const steps = [];
    let result = "";
    let complexity = "";

    if (scenario === "stack") {
      const stack = [...tokens];
      if (mode === "push") {
        stack.push(targetText || "new");
        steps.push(`push(${targetText || "new"})：新元素写入栈顶`);
      } else {
        const removed = stack.length ? stack.pop() : null;
        steps.push(`${mode}：${removed === null ? "空栈，无元素可取" : `移除栈顶 ${removed}`}`);
      }
      result = `栈底 [ ${stack.join(" · ")} ] 栈顶\nsize=${stack.length}；peek=${stack.at(-1) ?? "None"}`;
      complexity = "push/pop/peek 均为 O(1)（动态数组 push 为摊还 O(1)）";
    } else if (scenario === "queue") {
      const queue = [...tokens];
      let head = 0;
      const dequeued = [];
      if (mode === "enqueue") {
        queue.push(targetText || "new-task");
        steps.push("写入队尾，不影响已有队首");
      } else if (mode === "dequeue") {
        if (head < queue.length) dequeued.push(queue[head++]);
        steps.push(`推进 head 索引到 ${head}，不执行数组头部搬移`);
      } else if (queue.length >= 3) {
        steps.push("有界队列容量 3 已满：拒绝新任务并产生背压信号");
      } else {
        queue.push(targetText || "new-task");
        steps.push("容量仍有余量：任务进入队尾");
      }
      result = `已出队：${JSON.stringify(dequeued)}\n剩余 FIFO：${JSON.stringify(queue.slice(head))}\n底层 head=${head}`;
      complexity = "头索引 enqueue/dequeue 摊还 O(1)；容量治理是系统约束";
    } else if (scenario === "hash") {
      const bucketCount = Math.max(1, Math.min(20, Number(targetText) || 3));
      const count = mode === "resize" ? bucketCount * 2 : bucketCount;
      const buckets = Array.from({ length: count }, () => []);
      let collisions = 0;
      for (const key of tokens) {
        const hash = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const index = hash % count;
        if (buckets[index].length) collisions += 1;
        buckets[index].push(key);
        steps.push(`${key}: hash=${hash} → bucket[${index}]`);
      }
      const lookup = tokens[0] || "";
      result = `桶：${JSON.stringify(buckets)}\n冲突次数：${collisions}\n负载因子：${(tokens.length / count).toFixed(2)}${mode === "lookup" ? `\n查找 ${lookup}：只比较其所在桶` : ""}`;
      complexity = "分布良好时平均 O(1)；最坏冲突 O(n)；扩容重散列 O(n)";
    } else if (scenario === "tree") {
      const values = tokens.map((value) => value.toLowerCase() === "null" ? null : value);
      const walk = (index, order) => {
        if (index >= values.length || values[index] === null) return;
        if (order === "preorder") steps.push(values[index]);
        walk(index * 2 + 1, order);
        if (order === "inorder") steps.push(values[index]);
        walk(index * 2 + 2, order);
        if (order === "postorder") steps.push(values[index]);
      };
      if (mode === "level") {
        values.forEach((value) => { if (value !== null) steps.push(value); });
      } else {
        walk(0, mode);
      }
      let height = 0;
      values.forEach((value, index) => {
        if (value !== null) height = Math.max(height, Math.floor(Math.log2(index + 1)) + 1);
      });
      result = `${mode}：${steps.join(" → ") || "空树"}\n按节点数计算高度：${height}`;
      complexity = `访问每个非空节点一次，时间 O(n)；${mode === "level" ? "队列空间取决于最大层宽" : "栈空间取决于树高"}`;
      steps.length = 0;
      steps.push("索引 i 的左右孩子是 2i+1 与 2i+2");
    } else if (scenario === "bst") {
      const nodes = [];
      const insert = (key) => {
        if (!nodes.length) {
          nodes.push({ key, left: -1, right: -1 });
          return;
        }
        let current = 0;
        while (true) {
          const side = key < nodes[current].key ? "left" : "right";
          if (nodes[current][side] === -1) {
            nodes[current][side] = nodes.length;
            nodes.push({ key, left: -1, right: -1 });
            return;
          }
          current = nodes[current][side];
        }
      };
      numbers.forEach(insert);
      const target = Number(targetText);
      if (mode === "insert" && Number.isFinite(target)) insert(target);
      let current = nodes.length ? 0 : -1;
      let found = false;
      while (current !== -1 && Number.isFinite(target)) {
        steps.push(`比较 ${target} 与 ${nodes[current].key}`);
        if (nodes[current].key === target) {
          found = true;
          break;
        }
        current = target < nodes[current].key ? nodes[current].left : nodes[current].right;
      }
      const depths = nodes.map(() => 0);
      if (nodes.length) {
        const queue = [[0, 1]];
        for (let head = 0; head < queue.length; head += 1) {
          const [index, depth] = queue[head];
          depths[index] = depth;
          if (nodes[index].left !== -1) queue.push([nodes[index].left, depth + 1]);
          if (nodes[index].right !== -1) queue.push([nodes[index].right, depth + 1]);
        }
      }
      result = `节点数：${nodes.length}；高度：${Math.max(0, ...depths)}\n查找 ${targetText}：${found ? "命中" : "未命中"}\n路径长度：${steps.length}`;
      complexity = "操作成本 O(h)；平衡时 h≈log n，退化时 h=n";
    } else if (scenario === "heap") {
      const data = [...numbers];
      const down = (start) => {
        let index = start;
        while (true) {
          const left = index * 2 + 1;
          const right = left + 1;
          let smallest = index;
          if (left < data.length && data[left] < data[smallest]) smallest = left;
          if (right < data.length && data[right] < data[smallest]) smallest = right;
          if (smallest === index) break;
          [data[index], data[smallest]] = [data[smallest], data[index]];
          steps.push(`下沉交换索引 ${index} ↔ ${smallest}`);
          index = smallest;
        }
      };
      for (let index = Math.floor(data.length / 2) - 1; index >= 0; index -= 1) down(index);
      if (mode === "push") {
        data.push(Number(targetText) || 0);
        let index = data.length - 1;
        while (index > 0) {
          const parent = Math.floor((index - 1) / 2);
          if (data[parent] <= data[index]) break;
          [data[parent], data[index]] = [data[index], data[parent]];
          steps.push(`上浮交换索引 ${index} ↔ ${parent}`);
          index = parent;
        }
      } else if (mode === "pop" && data.length) {
        const root = data[0];
        const last = data.pop();
        if (data.length) {
          data[0] = last;
          down(0);
        }
        steps.unshift(`弹出根 ${root}，用末尾元素补根`);
      }
      result = `最小堆数组：${JSON.stringify(data)}\n堆顶：${data[0] ?? "None"}`;
      complexity = mode === "heapify" ? "自底向上建堆 O(n)" : "push/pop 沿树高移动 O(log n)";
    } else if (scenario === "graph") {
      const graph = new Map();
      const ensure = (node) => { if (!graph.has(node)) graph.set(node, []); };
      for (const edge of tokens) {
        const [from, to] = edge.split("-").map((item) => item?.trim());
        if (!from || !to) continue;
        ensure(from); ensure(to);
        graph.get(from).push(to);
        graph.get(to).push(from);
      }
      const start = graph.has(targetText) ? targetText : graph.keys().next().value;
      const visited = new Set();
      const visitFrom = (origin) => {
        const frontier = [origin];
        if (mode !== "dfs") visited.add(origin);
        while (frontier.length) {
          const node = mode === "dfs" ? frontier.pop() : frontier.shift();
          if (visited.has(node) && mode === "dfs") continue;
          visited.add(node);
          steps.push(node);
          const neighbors = graph.get(node) || [];
          for (const neighbor of mode === "dfs" ? [...neighbors].reverse() : neighbors) {
            if (!visited.has(neighbor)) {
              if (mode !== "dfs") visited.add(neighbor);
              frontier.push(neighbor);
            }
          }
        }
      };
      if (start) visitFrom(start);
      let components = start ? 1 : 0;
      if (mode === "components") {
        for (const node of graph.keys()) {
          if (!visited.has(node)) {
            components += 1;
            visitFrom(node);
          }
        }
      }
      result = `访问顺序：${steps.join(" → ") || "空图"}\n顶点=${graph.size}；边=${tokens.length}${mode === "components" ? `；连通分量=${components}` : ""}`;
      complexity = "邻接表遍历时间 O(V+E)，visited 空间 O(V)";
      steps.length = 0;
      steps.push(`${mode === "dfs" ? "栈" : "队列"}保存搜索前沿；发现节点时维护 visited`);
    } else if (scenario === "sorting") {
      const data = [...numbers];
      if (mode === "insertion") {
        for (let index = 1; index < data.length; index += 1) {
          const key = data[index];
          let position = index - 1;
          while (position >= 0 && data[position] > key) {
            data[position + 1] = data[position];
            position -= 1;
          }
          data[position + 1] = key;
          steps.push(`插入 ${key}：${JSON.stringify(data)}`);
        }
        complexity = "最坏 O(n²)，近乎有序时接近 O(n)，稳定且原地";
      } else if (mode === "selection") {
        for (let index = 0; index < data.length; index += 1) {
          let minimum = index;
          for (let scan = index + 1; scan < data.length; scan += 1) if (data[scan] < data[minimum]) minimum = scan;
          [data[index], data[minimum]] = [data[minimum], data[index]];
          steps.push(`选择位置 ${index}：${JSON.stringify(data)}`);
        }
        complexity = "始终 O(n²) 比较，原地但通常不稳定";
      } else {
        const mergeSort = (items) => {
          if (items.length <= 1) return items;
          const middle = Math.floor(items.length / 2);
          const left = mergeSort(items.slice(0, middle));
          const right = mergeSort(items.slice(middle));
          const merged = [];
          let a = 0; let b = 0;
          while (a < left.length || b < right.length) {
            if (b >= right.length || (a < left.length && left[a] <= right[b])) merged.push(left[a++]);
            else merged.push(right[b++]);
          }
          steps.push(`合并 ${JSON.stringify(left)} + ${JSON.stringify(right)} → ${JSON.stringify(merged)}`);
          return merged;
        };
        data.splice(0, data.length, ...mergeSort(data));
        complexity = "稳定 O(n log n)，标准数组实现使用 O(n) 辅助空间";
      }
      result = `排序结果：${JSON.stringify(data)}\n步骤数：${steps.length}`;
    } else if (scenario === "binary-search") {
      const data = [...numbers].sort((a, b) => a - b);
      const target = Number(targetText);
      let left = 0;
      let right = mode === "exact" ? data.length - 1 : data.length;
      let answer = -1;
      if (mode === "exact") {
        while (left <= right) {
          const mid = Math.floor((left + right) / 2);
          steps.push(`[${left},${right}] mid=${mid} value=${data[mid]}`);
          if (data[mid] === target) { answer = mid; break; }
          if (data[mid] < target) left = mid + 1; else right = mid - 1;
        }
      } else {
        while (left < right) {
          const mid = Math.floor((left + right) / 2);
          steps.push(`[${left},${right}) mid=${mid} value=${data[mid]}`);
          if (data[mid] < target || (mode === "upper" && data[mid] === target)) left = mid + 1;
          else right = mid;
        }
        answer = left;
      }
      result = `有序数据：${JSON.stringify(data)}\n${mode === "exact" ? "命中索引" : "边界插入点"}：${answer}`;
      complexity = "候选区间每轮至少减半，时间 O(log n)，空间 O(1)";
    } else if (scenario === "recursion") {
      const n = Math.max(0, Math.min(20, Number(raw) || 0));
      if (mode === "factorial") {
        let value = 1;
        for (let current = n; current > 0; current -= 1) {
          steps.push(`调用 f(${current})，等待 f(${current - 1}) 返回`);
          value *= current;
        }
        result = `${n}! = ${value}\n最大栈深：${n + 1}`;
        complexity = "时间 O(n)，调用栈 O(n)";
      } else if (mode === "fibonacci") {
        const calls = n <= 1 ? 1 : Math.round((2 * ((1 + Math.sqrt(5)) / 2) ** n) / Math.sqrt(5) - 1);
        result = `朴素 fib(${n}) 调用数约 ${calls}\n存在大量重复子问题`;
        steps.push("同一个 fib(k) 会从多个父分支重复展开");
        complexity = "朴素递归指数时间；记忆化后 O(n)";
      } else {
        const depth = n <= 1 ? 0 : Math.ceil(Math.log2(n));
        result = `规模 ${n} 连续减半，到基例约需 ${depth} 层`;
        steps.push(`${n} → ${Math.floor(n / 2)} → … → 1`);
        complexity = "单分支减半递归深度 O(log n)";
      }
    } else if (scenario === "backtracking") {
      const limit = Math.min(tokens.length, 7);
      const items = tokens.slice(0, limit);
      let solutions = [];
      if (mode === "subsets" || mode === "choose-k") {
        const wanted = Math.max(0, Number(targetText) || 0);
        const search = (index, path) => {
          if (mode === "choose-k" && path.length > wanted) return;
          if (index === items.length) {
            if (mode !== "choose-k" || path.length === wanted) solutions.push([...path]);
            return;
          }
          search(index + 1, path);
          path.push(items[index]);
          search(index + 1, path);
          path.pop();
        };
        search(0, []);
      } else {
        const search = (path, used) => {
          if (path.length === items.length) {
            solutions.push([...path]);
            return;
          }
          items.forEach((item, index) => {
            if (used.has(index)) return;
            used.add(index); path.push(item);
            search(path, used);
            path.pop(); used.delete(index);
          });
        };
        search([], new Set());
      }
      solutions = solutions.slice(0, 200);
      result = `生成 ${solutions.length} 个结果（界面最多展示 200）\n${JSON.stringify(solutions)}`;
      steps.push("每层：检查约束 → 做选择 → 递归 → 撤销选择");
      complexity = mode === "permutations" ? "排列搜索空间 n!" : "子集搜索空间 2^n；剪枝减少实际节点";
    } else if (scenario === "dp") {
      const n = Math.max(0, Math.min(100, Number(raw) || 0));
      if (mode === "climb") {
        let previous = 1; let current = 1;
        for (let index = 2; index <= n; index += 1) {
          [previous, current] = [current, previous + current];
          steps.push(`dp[${index}] = ${current}`);
        }
        result = `到达 ${n} 阶的方法数：${n <= 1 ? 1 : current}`;
        complexity = "时间 O(n)，压缩后额外空间 O(1)";
      } else if (mode === "fibonacci") {
        let a = 0; let b = 1;
        for (let index = 1; index <= n; index += 1) {
          steps.push(`fib[${index}] = ${b}`);
          [a, b] = [b, a + b];
        }
        result = `fib(${n}) = ${a}`;
        complexity = "每个状态只计算一次，O(n) 时间、O(1) 空间";
      } else {
        const coins = targetText.split(",").map(Number).filter((value) => Number.isFinite(value) && value > 0);
        const dp = [0, ...Array(n).fill(Infinity)];
        for (let amount = 1; amount <= n; amount += 1) {
          for (const coin of coins) if (coin <= amount) dp[amount] = Math.min(dp[amount], dp[amount - coin] + 1);
          steps.push(`dp[${amount}] = ${Number.isFinite(dp[amount]) ? dp[amount] : "不可达"}`);
        }
        result = `凑出 ${n} 的最少硬币：${Number.isFinite(dp[n]) ? dp[n] : "不可达"}`;
        complexity = "状态数 n × 硬币种类数，时间 O(nk)、空间 O(n)";
      }
    } else {
      const requirements = new Set(tokens);
      const stage = mode;
      let recommendation = "dynamic-array / 标准列表";
      if (requirements.has("priority")) recommendation = "heap / priority queue";
      else if (requirements.has("key-lookup") && requirements.has("recency-update")) recommendation = "hash table + doubly linked list";
      else if (requirements.has("fifo")) recommendation = "queue / deque";
      else if (requirements.has("lifo")) recommendation = "stack";
      const governance = {
        prototype: "标准库或单体内存结构；先补测试、容量上限和持久化判断",
        growth: "增加指标、有界队列、重试/死信、压测和明确所有权",
        scale: "按证据评估分区、复制、跨地域容灾、平台治理和成本"
      }[stage];
      result = `推荐：${recommendation}\n公司阶段：${stage}\n治理强度：${governance}\n规模参数：${targetText}`;
      steps.push("先读操作比例和顺序语义", "比较候选的时间、空间与实现成本", "按团队阶段设置演进触发器");
      complexity = "不存在脱离工作负载和组织能力的全局最优结构";
    }

    output = result;
    trace = `${steps.slice(0, 18).map((step, index) => `<div class="trace-row"><span>轨迹 ${index + 1}</span><b>${escapeHtml(step)}</b></div>`).join("")}
      <div class="trace-row"><span>复杂度结论</span><b>${escapeHtml(complexity)}</b></div>
      <div class="trace-row"><span>验证口径</span><b>同时检查正常、空输入、边界与最坏结构</b></div>
    `;
  } else if (lesson.lab.kind === "relational-model") {
    const tableName = document.querySelector("#relation-table-input").value.trim() || "unnamed_table";
    const columns = document.querySelector("#relation-columns-input").value.split(",").map((item) => item.trim()).filter(Boolean)
      .map((definition) => {
        const [name, rawType = "TEXT"] = definition.split(":");
        return { name: name.trim(), type: rawType.replace("!", "").trim().toUpperCase(), required: rawType.includes("!") };
      });
    const primaryKey = document.querySelector("#relation-primary-key-input").value.trim();
    const rawRows = document.querySelector("#relation-rows-input").value.split(/\r?\n/).filter((line) => line.trim());
    const seenKeys = new Set();
    const errors = [];
    const rowTraces = [];
    rawRows.forEach((line, rowIndex) => {
      const values = line.split(",").map((item) => item.trim());
      if (values.length !== columns.length) {
        errors.push(`第 ${rowIndex + 1} 行列数 ${values.length}，期望 ${columns.length}`);
        rowTraces.push(`第 ${rowIndex + 1} 行：列数错误`);
        return;
      }
      columns.forEach((column, columnIndex) => {
        if (column.required && values[columnIndex] === "") errors.push(`第 ${rowIndex + 1} 行 ${column.name} 违反 NOT NULL`);
      });
      const keyIndex = columns.findIndex((column) => column.name === primaryKey);
      if (keyIndex < 0) errors.push(`主键列 ${primaryKey} 不存在`);
      else {
        const key = values[keyIndex];
        if (!key) errors.push(`第 ${rowIndex + 1} 行主键为空`);
        else if (seenKeys.has(key)) errors.push(`第 ${rowIndex + 1} 行主键 ${key} 重复`);
        else seenKeys.add(key);
      }
      rowTraces.push(`第 ${rowIndex + 1} 行：${values.map((value) => value || "NULL").join(" | ")}`);
    });
    const schema = columns.map((column) =>
      `${column.name} ${column.type}${column.required ? " NOT NULL" : ""}${column.name === primaryKey ? " PRIMARY KEY" : ""}`
    );
    output = `表：${tableName}\n模式：\n  ${schema.join("\n  ")}\n样例行：${rawRows.length}\n检查结果：${errors.length ? `${errors.length} 个问题` : "约束全部通过"}\n${errors.join("\n")}`;
    trace = `${rowTraces.map((item, index) => `<div class="trace-row"><span>记录 ${index + 1}</span><b>${escapeHtml(item)}</b></div>`).join("")}
      <div class="trace-row"><span>身份约束</span><b>PRIMARY KEY ${escapeHtml(primaryKey)}：唯一且非空</b></div>
      <div class="trace-row"><span>NULL 口径</span><b>空单元格表示未知/不适用，不等于 0 或空字符串业务值</b></div>
      <div class="trace-row"><span>最终结论</span><b>${errors.length ? escapeHtml(errors.join("；")) : "模式与样例数据一致"}</b></div>
    `;
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
