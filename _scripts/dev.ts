/**
 * aesthetecoding.io — local dev server
 * Usage: bun dev   (or: bun _scripts/dev.ts)
 *
 * Serves dist/ on localhost:3000 with directory index support.
 * Watches _articles/, _templates/, _config/ and rebuilds on change (debounced 300ms).
 * Run `bun build` first if dist/ doesn't exist yet.
 */

import { existsSync } from "fs";
import { watch } from "fs";
import { join, extname } from "path";
import { readFile } from "fs/promises";
import { spawnSync } from "child_process";

const ROOT = new URL("..", import.meta.url).pathname;
const DIST = join(ROOT, "dist");
const PORT = parseInt(process.env.PORT ?? "3000", 10);

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

function rebuild(): void {
  console.log("\n  [dev] file changed — rebuilding…");
  const result = spawnSync("bun", [join(ROOT, "_scripts/build.ts")], { stdio: "inherit" });
  if (result.status !== 0) console.error("  [dev] build failed — dist/ unchanged");
}

function debounce(fn: () => void, ms: number): () => void {
  let timer: ReturnType<typeof setTimeout>;
  return () => { clearTimeout(timer); timer = setTimeout(fn, ms); };
}

if (!existsSync(DIST)) {
  console.log("  [dev] dist/ not found — running initial build…\n");
  rebuild();
}

// Watch source dirs for changes
const WATCH_DIRS = ["_articles", "_templates", "_config"];
const debouncedRebuild = debounce(rebuild, 300);
for (const dir of WATCH_DIRS) {
  const full = join(ROOT, dir);
  if (existsSync(full)) {
    watch(full, { recursive: true }, () => debouncedRebuild());
  }
}

// Static file server
Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

    // resolve directory → index.html
    if (pathname.endsWith("/")) pathname += "index.html";
    // no extension → try /index.html
    if (!extname(pathname)) pathname += "/index.html";

    const filePath = join(DIST, pathname);

    if (!existsSync(filePath)) {
      const notFound = join(DIST, "404.html");
      const body = existsSync(notFound) ? await readFile(notFound) : "Not found";
      return new Response(body, { status: 404, headers: { "content-type": "text/html" } });
    }

    const ext = extname(filePath);
    const contentType = MIME[ext] ?? "application/octet-stream";
    const body = await readFile(filePath);
    return new Response(body, { headers: { "content-type": contentType } });
  },
});

console.log(`\n⬡  dev server → http://localhost:${PORT}`);
console.log(`   watching: ${WATCH_DIRS.join(", ")}`);
console.log("   Ctrl+C to stop\n");
