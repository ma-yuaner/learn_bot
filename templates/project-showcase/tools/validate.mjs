import { project } from "../project.config.js";
import { modules } from "../data/modules.js";
import { assertValidShowcase } from "../lib/schema.js";

assertValidShowcase(project, modules);
console.log(`配置有效：${project.title}，${modules.length} 个模块`);
