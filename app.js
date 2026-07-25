import { firstLesson, tracks } from "./data/curriculum.js";

const storageKey = "ai-explorer-progress-v1";
const defaultProgress = {
  concept: false,
  prediction: false,
  workshop: false,
  quiz: 0,
  explanation: 0
};
let progress = loadProgress();

function loadProgress() {
  try {
    return { ...defaultProgress, ...JSON.parse(localStorage.getItem(storageKey)) };
  } catch {
    return { ...defaultProgress };
  }
}

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(progress));
  renderProgress();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderBaseContent() {
  document.querySelector("#lesson-title").textContent = firstLesson.title;
  document.querySelector("#lesson-duration").textContent = firstLesson.duration;
  document.querySelector("#objectives").innerHTML = firstLesson.objectives.map((item) => `<li>${item}</li>`).join("");
  document.querySelector("#concept-grid").innerHTML = firstLesson.concepts.map((item) => `
    <article class="concept-card"><b>${item.term}</b><p>${item.detail}</p></article>
  `).join("");
  document.querySelector("#type-rows").innerHTML = firstLesson.types.map((row) => `
    <div class="type-row"><code>${row[0]}</code><b>${row[1]}</b><span>${row[2]}</span><span>${row[3]}</span></div>
  `).join("");
  document.querySelector("#prediction-code").textContent = firstLesson.prediction.code;
  document.querySelector("#prediction-choices").innerHTML = firstLesson.prediction.choices.map((choice) =>
    `<button class="choice" data-answer="${choice}">${choice}</button>`
  ).join("");
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
      <small>${track.available ? "首个关卡已开放" : `${track.chapters.length} 个关卡 · 待解锁`}</small>
    </article>
  `).join("");
  document.querySelector("#quiz-questions").innerHTML = firstLesson.quiz.map((quiz, questionIndex) => `
    <section class="quiz-question">
      <h3>${questionIndex + 1}. ${quiz.question}</h3>
      ${quiz.options.map((option, optionIndex) => `
        <label><input type="radio" name="quiz-${questionIndex}" value="${optionIndex}" />${option}</label>
      `).join("")}
    </section>
  `).join("");
}

function scores() {
  return {
    知识: progress.concept ? 100 : 0,
    推理: progress.prediction ? 100 : 0,
    实操: progress.workshop ? 100 : 0,
    表达: Math.round((progress.quiz + progress.explanation) / 2)
  };
}

function renderProgress() {
  const dimensions = scores();
  const total = Math.round(Object.values(dimensions).reduce((sum, value) => sum + value, 0) / 4);
  const completed = [
    progress.concept,
    progress.prediction,
    progress.workshop,
    progress.quiz >= 70 && progress.explanation >= 60
  ].filter(Boolean).length;
  const xp = Math.round(total * 4);

  document.querySelector("#mastery-total").textContent = total;
  document.querySelector("#mastery-bars").innerHTML = Object.entries(dimensions).map(([label, score]) => `
    <div class="mastery-row"><span>${label}</span><div class="mastery-track"><i style="width:${score}%"></i></div><b>${score}</b></div>
  `).join("");
  document.querySelector("#mission-progress").style.width = `${completed * 25}%`;
  document.querySelector("#mission-status").textContent = `${completed} / 4 个检查点`;
  document.querySelector("#level-progress").style.width = `${total}%`;
  document.querySelector("#xp-label").textContent = `${xp} XP`;
  document.querySelector("#level-number").textContent = String(Math.max(1, Math.ceil(xp / 250))).padStart(2, "0");
  document.querySelector('[data-checkpoint="concept"]').checked = progress.concept;
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

function bindInteractions() {
  document.querySelectorAll("[data-scroll]").forEach((button) => {
    button.addEventListener("click", () => document.querySelector(`#${button.dataset.scroll}`).scrollIntoView());
  });

  document.querySelector('[data-checkpoint="concept"]').addEventListener("change", (event) => {
    progress.concept = event.target.checked;
    saveProgress();
    toast(progress.concept ? "检查点已记录 +100 知识" : "检查点已取消");
  });

  document.querySelectorAll("#prediction-choices .choice").forEach((button) => {
    button.addEventListener("click", () => {
      const correct = button.dataset.answer === firstLesson.prediction.answer;
      document.querySelectorAll("#prediction-choices .choice").forEach((node) => {
        node.classList.remove("correct", "wrong");
        if (node.dataset.answer === firstLesson.prediction.answer) node.classList.add("correct");
      });
      if (!correct) button.classList.add("wrong");
      showFeedback(
        document.querySelector("#prediction-feedback"),
        `<b>${correct ? "判断正确。" : "这次不对，再沿着每一行追踪。"}</b><br>${firstLesson.prediction.explanation}`,
        correct
      );
      if (correct) {
        progress.prediction = true;
        saveProgress();
      }
    });
  });

  const range = document.querySelector("#supply-input");
  range.addEventListener("input", () => { document.querySelector("#supply-output").value = range.value; });
  document.querySelector("#run-workbench").addEventListener("click", () => {
    const name = document.querySelector("#name-input").value.trim() || "未命名探险家";
    const energy = Math.max(0, Math.min(100, Number(document.querySelector("#energy-input").value) || 0));
    const supply = Number(range.value);
    const finalEnergy = Math.min(100, energy + supply);
    document.querySelector("#terminal-output").textContent =
      `${name} 出发！\n初始能量：${energy}\n获得补给：${supply}\n当前能量：${finalEnergy}`;
    document.querySelector("#state-trace").innerHTML = `
      <div class="trace-row"><span>name · str</span><b>"${escapeHtml(name)}"</b></div>
      <div class="trace-row"><span>energy · int</span><b>${energy} → ${finalEnergy}</b></div>
      <div class="trace-row"><span>supply · int</span><b>${supply}</b></div>
      <div class="trace-row"><span>计算规则</span><b>min(100, energy + supply)</b></div>
    `;
    progress.workshop = true;
    saveProgress();
    toast("实操检查点完成 +100 实操");
  });

  document.querySelector("#quiz-form").addEventListener("submit", (event) => {
    event.preventDefault();
    let correct = 0;
    const explanations = [];
    firstLesson.quiz.forEach((quiz, index) => {
      const selected = new FormData(event.currentTarget).get(`quiz-${index}`);
      if (Number(selected) === quiz.answer) correct += 1;
      else explanations.push(`第 ${index + 1} 题：${quiz.reason}`);
    });
    const score = Math.round((correct / firstLesson.quiz.length) * 100);
    progress.quiz = score;
    saveProgress();
    showFeedback(
      document.querySelector("#quiz-result"),
      `<b>得分 ${score} / 100</b><br>${score === 100 ? "三题全部正确。你已掌握本关的基础辨析。" : explanations.join("<br>")}`,
      score >= 70
    );
  });

  document.querySelector("#evaluate-explanation").addEventListener("click", () => {
    const answer = document.querySelector("#explanation-input").value.trim();
    const groups = [
      ["赋值", "指向", "保存", "更新"],
      ["旧值", "原来", "当前"],
      ["加", "计算", "得到"],
      ["新值", "变成", "重新"]
    ];
    const hitCount = groups.filter((keywords) => keywords.some((word) => answer.includes(word))).length;
    const lengthBonus = answer.length >= 35 ? 1 : 0;
    const score = Math.min(100, hitCount * 20 + lengthBonus * 20);
    progress.explanation = score;
    saveProgress();
    const missing = [];
    if (!groups[0].some((word) => answer.includes(word))) missing.push("说明等号表示赋值");
    if (!groups[1].some((word) => answer.includes(word))) missing.push("指出先读取 level 的旧值");
    if (!groups[2].some((word) => answer.includes(word))) missing.push("描述旧值加 1 的计算");
    if (!groups[3].some((word) => answer.includes(word))) missing.push("说明结果会成为 level 的新值");
    showFeedback(
      document.querySelector("#explanation-feedback"),
      `<b>表达评分 ${score} / 100</b><br>${missing.length ? `还可以补充：${missing.join("；")}。` : "解释形成了完整的“读取 → 计算 → 更新”链条。"}<br><small>这是关键词初评，后续版本会加入更深入的追问式评估。</small>`,
      score >= 60
    );
  });

  document.querySelector("#reset-progress").addEventListener("click", () => {
    if (!confirm("确定清除这台设备上的学习进度吗？")) return;
    localStorage.removeItem(storageKey);
    progress = { ...defaultProgress };
    document.querySelector("#quiz-form").reset();
    document.querySelector("#explanation-input").value = "";
    renderProgress();
    toast("本地进度已重置");
  });

  document.querySelectorAll(".track-link").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.track === "python") document.querySelector("#concepts").scrollIntoView();
      else {
        const track = tracks.find((item) => item.id === button.dataset.track);
        toast(`${track.title}正在编写中，课程地图已预留 ${track.chapters.length} 个章节`);
      }
    });
  });
}

renderBaseContent();
renderProgress();
bindInteractions();
