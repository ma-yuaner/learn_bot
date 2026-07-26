import { project } from "./project.config.js";
import { modules } from "./data/modules.js";
import { assertValidShowcase } from "./lib/schema.js";

const key = `showcase:${project.id}:${project.version}`;
let state = loadState();

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (stored?.activeModuleId && stored?.evidence) return stored;
  } catch {
    // 损坏状态使用默认值。
  }
  return { activeModuleId: modules[0]?.id, evidence: {}, scores: {} };
}

function saveState() {
  localStorage.setItem(key, JSON.stringify(state));
}

const html = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const currentModule = () => modules.find((module) => module.id === state.activeModuleId) || modules[0];

function applyProject() {
  document.title = `${project.title} · Project Showcase`;
  document.documentElement.style.setProperty("--primary", project.theme.primary);
  document.documentElement.style.setProperty("--accent", project.theme.accent);
  document.documentElement.style.setProperty("--bg", project.theme.background);
  document.documentElement.style.setProperty("--ink", project.theme.ink);
  document.querySelector("#brand").textContent = project.title;
  document.querySelector("#kicker").textContent = project.kicker;
  document.querySelector("#project-title").textContent = project.title;
  document.querySelector("#project-summary").textContent = project.summary;
  document.querySelector("#project-meta").textContent = `${project.status} · v${project.version}`;
  document.querySelector("#project-metrics").innerHTML = project.metrics.map((metric) =>
    `<div class="metric"><strong>${html(metric.value)}</strong><small>${html(metric.label)}</small></div>`
  ).join("");
}

function renderNavigation() {
  document.querySelector("#module-nav").innerHTML = modules.map((module) =>
    `<button data-module="${module.id}" class="${module.id === state.activeModuleId ? "active" : ""}">${module.order} ${html(module.title)}</button>`
  ).join("");
}

function renderModule() {
  const module = currentModule();
  document.querySelector("#module-eyebrow").textContent = `${module.eyebrow} · ${module.status.toUpperCase()}`;
  document.querySelector("#module-title").textContent = module.title;
  document.querySelector("#module-summary").textContent = module.summary;
  document.querySelector("#module-problem").textContent = module.problem;
  document.querySelector("#module-outcome").textContent = module.outcome;
  document.querySelector("#architecture-nodes").innerHTML = module.architecture.nodes.map((node) =>
    `<article class="node"><b>${html(node.label)}</b><p>${html(node.role)}</p><small>${html(node.id)}</small></article>`
  ).join("");
  document.querySelector("#architecture-edges").innerHTML = module.architecture.edges.map((edge) =>
    `<div>${html(edge.from)} <span>→ ${html(edge.label)} →</span> ${html(edge.to)}</div>`
  ).join("");
  document.querySelector("#decisions").innerHTML = module.decisions.map((decision) => `
    <article class="decision"><h3>${html(decision.question)}</h3><dl>
      <dt>选择</dt><dd>${html(decision.choice)}</dd><dt>原因</dt><dd>${html(decision.reason)}</dd><dt>代价</dt><dd>${html(decision.tradeoff)}</dd>
    </dl></article>`).join("");
  document.querySelector("#walkthrough").innerHTML = module.walkthrough.map((step) =>
    `<article class="step"><h3>${html(step.title)}</h3><p>${html(step.detail)}</p><small>证据：${html(step.evidence)}</small></article>`
  ).join("");
  renderInteraction(module);
  renderAssessment(module);
  renderDeliverables(module);
  renderNavigation();
}

function renderInteraction(module) {
  const interaction = module.interaction;
  document.querySelector("#interaction-controls").innerHTML = `
    <h3>${html(interaction.title)}</h3><p>${html(interaction.prompt)}</p>
    ${interaction.controls.map((control) => `<label>${html(control.label)}<select data-control="${control.id}">
      ${control.options.map(([value, label]) => `<option value="${html(value)}">${html(label)}</option>`).join("")}
    </select></label>`).join("")}
    <button id="run-interaction">运行场景</button>`;
  document.querySelector("#interaction-result").textContent = "等待选择…";
  document.querySelector("#run-interaction").onclick = () => {
    const values = Object.fromEntries([...document.querySelectorAll("[data-control]")].map((node) => [node.dataset.control, node.value]));
    const outcome = interaction.outcomes.find((candidate) =>
      Object.entries(candidate.when).every(([name, value]) => values[name] === value)
    ) || interaction.fallback;
    document.querySelector("#interaction-result").textContent = `${outcome.result}\n\n${outcome.explanation}`;
  };
}

function renderAssessment(module) {
  document.querySelector("#assessment").innerHTML = `${module.assessment.map((question, index) => `
    <article class="question"><h3>${index + 1}. ${html(question.question)}</h3>${question.options.map((option, optionIndex) =>
      `<label><input type="radio" name="question-${index}" value="${optionIndex}" />${html(option)}</label>`
    ).join("")}</article>`).join("")}<button id="submit-assessment" type="submit">提交验收</button>`;
  document.querySelector("#assessment-result").textContent = "尚未提交";
  document.querySelector("#assessment").onsubmit = (event) => {
    event.preventDefault();
    let correct = 0;
    const feedback = [];
    module.assessment.forEach((question, index) => {
      const selected = document.querySelector(`input[name="question-${index}"]:checked`);
      if (Number(selected?.value) === question.answer) correct += 1;
      else feedback.push(question.explanation);
    });
    const score = Math.round((correct / module.assessment.length) * 100);
    state.scores[module.id] = score;
    saveState();
    document.querySelector("#assessment-result").textContent = `得分 ${score}/100${feedback.length ? `\n${feedback.join("\n")}` : "\n全部回答正确。"}`;
  };
}

function renderDeliverables(module) {
  document.querySelector("#deliverables").innerHTML = module.deliverables.map((item, index) => {
    const id = `${module.id}:${index}`;
    return `<label><input type="checkbox" data-evidence="${id}" ${state.evidence[id] ? "checked" : ""} />${html(item)}</label>`;
  }).join("");
  document.querySelectorAll("[data-evidence]").forEach((node) => {
    node.onchange = () => {
      state.evidence[node.dataset.evidence] = node.checked;
      saveState();
    };
  });
}

try {
  assertValidShowcase(project, modules);
  applyProject();
  renderModule();
  document.querySelector("#module-nav").onclick = (event) => {
    const button = event.target.closest("[data-module]");
    if (!button) return;
    state.activeModuleId = button.dataset.module;
    saveState();
    renderModule();
    document.querySelector(".module-header").scrollIntoView();
  };
} catch (error) {
  const panel = document.querySelector("#config-error");
  panel.hidden = false;
  panel.textContent = error.message;
}
