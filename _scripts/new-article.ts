/**
 * aesthetecoding.io — interactive article scaffolder
 * Usage: bun new   (or: bun _scripts/new-article.ts)
 *
 * Creates _articles/{YYYY-MM-DD-slug}/
 *   meta.json     — prefilled metadata
 *   content.html  — article body starter (only the .col content)
 *   assets/       — empty folder for images
 */

import { mkdir, writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import readline from "readline";

const ROOT = new URL("..", import.meta.url).pathname;
const ARTICLES_SRC = join(ROOT, "_articles");
const TEMPLATES = join(ROOT, "_templates");
const CONFIG_DIR = join(ROOT, "_config");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string, fallback = ""): Promise<string> =>
  new Promise(res => rl.question(`${q}${fallback ? ` [${fallback}]` : ""}: `, ans => res(ans.trim() || fallback)));

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CONTENT_STARTER = `<!-- Article body — only what goes inside <div class="col">
     See _components/catalog.html for every available component.
     Use root-relative paths for links (/articles/other-slug/).
     Article assets live in assets/ (referenced as assets/file.jpg here). -->

<p class="lead">Opening lead paragraph goes here — sets the tone for the whole piece.</p>

<!-- ON THIS PAGE -->
<nav class="toc" aria-label="On this page">
  <h4>On this page</h4>
  <ol>
    <li><a href="#section-one">Section one</a></li>
  </ol>
</nav>

<p>First paragraph of the article body.</p>

<h2 id="section-one">Section one</h2>
<p>Content here.</p>
`;

const SLIDES_STARTER = `<!-- Deck content — only <section class="slide"> blocks, no wrapper.
     See _templates/article-deck.html for every slide situation — copy only
     the ones this deck actually needs, not the whole catalogue. -->

<section class="slide slide--gradient" data-label="Cover">
  <div class="eyebrow">Kicker</div>
  <h1 class="title title--hero">Deck Title Goes Here</h1>
  <div class="footer"><span class="wm"><span class="b">{</span> aesthetecoding.io <span class="b">}</span></span><span data-deck-page></span></div>
</section>

<section class="slide" data-label="First point">
  <p class="eyebrow">Eyebrow</p>
  <h2 class="title">First point</h2>
  <div class="footer"><span class="wm"><span class="b">{</span> aesthetecoding.io <span class="b">}</span></span><span data-deck-page></span></div>
</section>
`;

async function main(): Promise<void> {
  const categories = JSON.parse(await readFile(join(CONFIG_DIR, "categories.json"), "utf-8")) as Record<string, { label: string }>;
  const catKeys = Object.keys(categories);

  console.log("\n⬡  New article\n");

  const title = await ask("Title");
  if (!title) { console.error("title is required"); process.exit(1); }

  const defaultSlug = toSlug(title);
  const slug = await ask("Slug (URL path)", defaultSlug);

  const today = new Date().toISOString().slice(0, 10);
  const date = await ask("Date (YYYY-MM-DD)", today);

  console.log(`\nCategories: ${catKeys.join(" | ")}`);
  const category = await ask("Category", catKeys[0]);

  const format = await ask("Format — article or deck", "article") as "article" | "deck";

  const description = await ask("Description (≤155 chars for SEO)");
  const readingTime = await ask("Estimated reading time (minutes)", "5");

  console.log("\nAI Provenance: none | enriched | full");
  const aiProvenance = await ask("AI provenance", "none") as "none" | "enriched" | "full";

  const cover = await ask("Cover image filename (leave blank if none)", "");
  const featuredCover = cover
    ? await ask("Featured card crop filename — 5:4, optional, leave blank to reuse cover", "")
    : "";
  const listCover = cover
    ? await ask("List thumbnail crop filename — square, optional, leave blank to reuse cover", "")
    : "";

  rl.close();

  // validate
  if (!["none", "enriched", "full"].includes(aiProvenance)) {
    console.error("invalid aiProvenance — must be none | enriched | full");
    process.exit(1);
  }
  if (!["article", "deck"].includes(format)) {
    console.error("invalid format — must be article | deck");
    process.exit(1);
  }

  const folder = `${date}-${slug}`;
  const dest = join(ARTICLES_SRC, folder);

  if (existsSync(dest)) {
    console.error(`\nfolder already exists: _articles/${folder}`);
    process.exit(1);
  }

  const meta = {
    title,
    slug,
    date,
    category,
    tags: [category],
    description,
    readingTime: parseInt(readingTime, 10) || 5,
    aiProvenance,
    ...(cover ? { cover, coverAlt: "", coverFocus: "50% 50%", ecoCoverDescription: "" } : {}),
    ...(featuredCover ? { featuredCover, featuredCoverFocus: "50% 50%" } : {}),
    ...(listCover ? { listCover, listCoverFocus: "50% 50%" } : {}),
    featured: false,
    status: "draft",
    ...(format === "deck" ? { format } : {}),
  };

  await mkdir(join(dest, "assets"), { recursive: true });
  await writeFile(join(dest, "meta.json"), JSON.stringify(meta, null, 2));
  await writeFile(join(dest, format === "deck" ? "slides.html" : "content.html"), format === "deck" ? SLIDES_STARTER : CONTENT_STARTER);

  const bodyFile = format === "deck" ? "slides.html" : "content.html";
  console.log(`\n✅  created _articles/${folder}/`);
  console.log(`    edit content → _articles/${folder}/${bodyFile}`);
  console.log(`    drop images  → _articles/${folder}/assets/`);
  console.log(`    publish      → set "status": "published" in meta.json`);
  console.log(`    build        → bun build\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
