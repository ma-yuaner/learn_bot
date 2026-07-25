import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const port = Number(process.env.PORT || 4173);
const root = process.cwd();
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function readJsonBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 20_000) throw new Error("PAYLOAD_TOO_LARGE");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function evaluatePython(request, response) {
  let payload;
  try {
    payload = await readJsonBody(request);
  } catch (error) {
    sendJson(response, error.message === "PAYLOAD_TOO_LARGE" ? 413 : 400, {
      ok: false,
      message: error.message === "PAYLOAD_TOO_LARGE" ? "提交内容过大" : "请求格式错误"
    });
    return;
  }

  const evaluator = spawn("python3", ["-I", "-S", join(root, "tools/evaluator.py")], {
    cwd: root,
    env: { PATH: process.env.PATH || "/usr/bin:/bin" },
    stdio: ["pipe", "pipe", "pipe"]
  });
  let stdout = "";
  let stderr = "";
  const timeout = setTimeout(() => evaluator.kill("SIGKILL"), 2_500);

  evaluator.stdout.on("data", (chunk) => { stdout += chunk; });
  evaluator.stderr.on("data", (chunk) => { stderr += chunk; });
  evaluator.on("error", () => {
    clearTimeout(timeout);
    sendJson(response, 503, { ok: false, message: "本机未找到 Python 3 执行环境" });
  });
  evaluator.on("close", (code) => {
    clearTimeout(timeout);
    if (response.writableEnded) return;
    try {
      sendJson(response, 200, JSON.parse(stdout));
    } catch {
      sendJson(response, 500, {
        ok: false,
        message: code === null ? "代码运行超时" : "验收器未能返回有效结果",
        detail: stderr.slice(0, 300)
      });
    }
  });
  evaluator.stdin.end(JSON.stringify(payload));
}

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  if (request.method === "POST" && pathname === "/api/evaluate") {
    await evaluatePython(request, response);
    return;
  }
  if (request.method !== "GET") {
    response.writeHead(405, { Allow: "GET, POST" });
    response.end("Method not allowed");
    return;
  }
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const safePath = normalize(relativePath);

  if (safePath.startsWith("..")) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(join(root, safePath));
    response.writeHead(200, { "Content-Type": types[extname(safePath)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, () => {
  console.log(`AI 探险家已启动：http://localhost:${port}`);
});
