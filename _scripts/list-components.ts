/**
 * aesthetecoding.io — component catalog lister
 * Usage: bun components   (or: bun _scripts/list-components.ts)
 *
 * Parses _components/catalog.html and prints a structured list of
 * every available component with its class name(s) and description.
 */

import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

const ROOT = new URL("..", import.meta.url).pathname;
const CATALOG = join(ROOT, "_components", "catalog.html");

interface Component {
  name: string;
  classes: string[];
  attrs: string[];
  description: string;
}

function extractComponents(html: string): Component[] {
  const components: Component[] = [];

  // Find HTML comments used as section labels: <!-- COMPONENT: name — description -->
  const sectionRe = /<!--\s*([A-Z][^-\n]+?)(?:\s*—\s*([^\n]*?))?\s*-->/g;
  let match: RegExpExecArray | null;

  // Also extract notable class patterns used in the design system
  const classSections: Array<{ name: string; classes: string[]; attrs: string[]; desc: string }> = [
    { name: "Lead paragraph",        classes: [".lead"],             attrs: [],                     desc: "Opening paragraph — larger serif, dimmed color" },
    { name: "Table of contents",     classes: [".toc"],              attrs: [],                     desc: "nav.toc with h4 + ordered list of anchor links" },
    { name: "TL;DR box",             classes: [".tldr"],             attrs: [],                     desc: "div.tldr — key takeaways before the body" },
    { name: "Callout — note",        classes: [".callout", ".callout--note"],  attrs: [],           desc: "aside.callout.callout--note with icon + title + body" },
    { name: "Callout — tip",         classes: [".callout", ".callout--tip"],   attrs: [],           desc: "aside.callout.callout--tip" },
    { name: "Callout — warning",     classes: [".callout", ".callout--warn"],  attrs: [],           desc: "aside.callout.callout--warn" },
    { name: "Data table",            classes: [".table-wrap"],       attrs: [],                     desc: "div.table-wrap > table — horizontally scrollable" },
    { name: "Figure — right float",  classes: [".fig", ".fig--right"],  attrs: ["style='--w:300px'"], desc: "figure.fig.fig--right — text wraps left; --w controls width" },
    { name: "Terminal block",        classes: [".terminal"],         attrs: [],                     desc: "div.terminal — macOS-style bar + pre with .cmd/.out spans" },
    { name: "Code block",            classes: [".codeblock"],        attrs: ["data-lang"],          desc: "figure.codeblock[data-lang] with copy button + syntax spans" },
    { name: "Numbered steps",        classes: [".steps"],            attrs: [],                     desc: "ol.steps — bold h4 heading per step" },
    { name: "Pull quote",            classes: [".pullquote"],        attrs: [],                     desc: "p.pullquote — large display quote" },
    { name: "2-column grid",         classes: [".grid-2"],           attrs: [],                     desc: "div.grid-2 — two equal columns, collapses on mobile" },
    { name: "Blockquote + cite",     classes: [],                    attrs: [],                     desc: "blockquote > p + cite — right-aligned cite" },
    { name: "Definition list",       classes: [],                    attrs: [],                     desc: "dl > dt + dd pairs — term + definition" },
    { name: "Pros / cons",           classes: [".proscons", ".pros", ".cons"], attrs: [],           desc: "div.proscons > div.pros + div.cons — side-by-side lists" },
    { name: "Divider ornament",      classes: [".divider-orn"],      attrs: [],                     desc: "div.divider-orn[role=separator] — centered ◇ glyph" },
    { name: "Further reading",       classes: [".readmore"],         attrs: [],                     desc: "div.readmore > a.readmore-card — 2-column card grid" },
    { name: "Footnotes",             classes: [".footnotes"],        attrs: [],                     desc: "section.footnotes > ol — numbered, back-linked" },
    { name: "Post tags",             classes: [".post-tags"],        attrs: [],                     desc: "div.post-tags > a — pill chips" },
    { name: "Inline highlight",      classes: [".hl"],               attrs: [],                     desc: "span.hl — amber highlight; span.hl.hl--green for green" },
    { name: "Rough annotation",      classes: [],                    attrs: ["data-rough", "data-rough-color"], desc: "data-rough='highlight|underline|box' data-rough-color='amber|green|blue'" },
    { name: "Inline code",           classes: [],                    attrs: [],                     desc: "<code> — monospace, pill background" },
    { name: "Keyboard key",          classes: [],                    attrs: [],                     desc: "<kbd> — styled keyboard key" },
    { name: "Footnote ref",          classes: [".fn-ref"],           attrs: [],                     desc: "<a href='#fn1' class='fn-ref'>1</a> — superscript link to footnotes" },
  ];

  return classSections.map(s => ({
    name: s.name,
    classes: s.classes,
    attrs: s.attrs,
    description: s.desc,
  }));
}

async function main(): Promise<void> {
  const catalogExists = existsSync(CATALOG);
  if (!catalogExists) {
    console.warn("⚠  _components/catalog.html not found — listing from built-in registry\n");
  }

  // If catalog exists, also scan it for any component comments
  let extra: string[] = [];
  if (catalogExists) {
    const html = await readFile(CATALOG, "utf-8");
    const commentRe = /<!--\s*(?:COMPONENT|ELEMENT):\s+([^-\n]+?)(?:\s*—\s*([^\n]*?))?\s*-->/gi;
    let m: RegExpExecArray | null;
    while ((m = commentRe.exec(html)) !== null) {
      extra.push(`  ${m[1].trim()}${m[2] ? ` — ${m[2].trim()}` : ""}`);
    }
  }

  const components = extractComponents("");

  const hr = "-".repeat(70);
  console.log("\n⬡  aesthetecoding.io — Component Catalog\n");
  console.log(hr);

  for (const c of components) {
    const cls = c.classes.length ? c.classes.join(" ") : "—";
    const attrs = c.attrs.length ? `  attrs: ${c.attrs.join(", ")}` : "";
    console.log(`\n  ${c.name}`);
    console.log(`    class: ${cls}${attrs}`);
    console.log(`    ${c.description}`);
  }

  if (extra.length) {
    console.log(`\n${hr}`);
    console.log("\n  From catalog.html comments:\n");
    extra.forEach(e => console.log(e));
  }

  console.log(`\n${hr}`);
  console.log(`\n  Reference: _components/catalog.html`);
  console.log(`  Total components: ${components.length}\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
