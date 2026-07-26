const statuses = new Set(["planned", "building", "ready"]);

export function validateShowcase(project, modules) {
  const errors = [];
  if (!project?.id) errors.push("project.id 不能为空");
  if (!project?.title) errors.push("project.title 不能为空");
  if (!project?.summary) errors.push("project.summary 不能为空");
  if (!Array.isArray(modules) || modules.length === 0) errors.push("modules 至少包含一个模块");
  const ids = new Set();
  for (const [index, module] of (modules || []).entries()) {
    const at = `modules[${index}]`;
    if (!module.id) errors.push(`${at}.id 不能为空`);
    if (ids.has(module.id)) errors.push(`${at}.id 重复：${module.id}`);
    ids.add(module.id);
    if (!module.title || !module.summary || !module.problem || !module.outcome) errors.push(`${at} 缺少标题、摘要、问题或结果`);
    if (!statuses.has(module.status)) errors.push(`${at}.status 必须是 planned/building/ready`);
    if (!module.architecture?.nodes?.length) errors.push(`${at}.architecture.nodes 不能为空`);
    const nodeIds = new Set((module.architecture?.nodes || []).map((node) => node.id));
    for (const edge of module.architecture?.edges || []) {
      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) errors.push(`${at} 架构边引用不存在的节点`);
    }
    if (!module.decisions?.length) errors.push(`${at}.decisions 不能为空`);
    if (!module.walkthrough?.length) errors.push(`${at}.walkthrough 不能为空`);
    if (!module.deliverables?.length) errors.push(`${at}.deliverables 不能为空`);
    for (const question of module.assessment || []) {
      if (!question.options?.[question.answer]) errors.push(`${at} 存在无效测验答案`);
    }
    for (const outcome of module.interaction?.outcomes || []) {
      if (!outcome.when || !outcome.result || !outcome.explanation) errors.push(`${at} 存在不完整交互结果`);
    }
  }
  return errors;
}

export function assertValidShowcase(project, modules) {
  const errors = validateShowcase(project, modules);
  if (errors.length) throw new Error(`项目展示配置无效：\n- ${errors.join("\n- ")}`);
}
