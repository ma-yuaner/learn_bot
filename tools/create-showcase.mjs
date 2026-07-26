import { cp, readFile, stat, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [, , targetArg, ...titleParts] = process.argv;
if (!targetArg) {
  console.error('用法：node tools/create-showcase.mjs <目标目录> "项目名称"');
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "templates/project-showcase");
const target = resolve(process.cwd(), targetArg);
if (target === process.cwd() || target === root) {
  console.error("目标必须是一个新的子目录");
  process.exit(1);
}
try {
  await stat(target);
  console.error(`目标已存在，未覆盖：${target}`);
  process.exit(1);
} catch {
  // 目标不存在，允许创建。
}

await cp(source, target, { recursive: true, errorOnExist: true });
const configPath = resolve(target, "project.config.js");
const title = titleParts.join(" ").trim() || basename(target);
const id = basename(target).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || "showcase-project";
const config = await readFile(configPath, "utf8");
await writeFile(
  configPath,
  config.replace('id: "example-observatory"', `id: ${JSON.stringify(id)}`).replace('title: "Example Observatory"', `title: ${JSON.stringify(title)}`),
  "utf8"
);
console.log(`已创建 ${title}：${target}`);
