import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const port = Number(process.env.PORT || 4180);
const root = dirname(fileURLToPath(import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json" };

createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  const safePath = normalize(decodeURIComponent(pathname === "/" ? "/index.html" : pathname)).replace(/^[/\\]+/, "");
  if (safePath.startsWith("..")) {
    response.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const body = await readFile(join(root, safePath));
    response.writeHead(200, { "Content-Type": types[extname(safePath)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(port, () => console.log(`Project Showcase：http://localhost:${port}`));
