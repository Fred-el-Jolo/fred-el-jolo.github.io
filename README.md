# {aesthetecoding.io}

Personal blog — field notes on Linux, dev environments, and the craft of the terminal.

Live at **[aesthetecoding.io](https://aesthetecoding.io)**.

---

## Stack

Pure static HTML/CSS/JS. No framework, no templating engine, no SASS compilation.
Build pipeline is TypeScript run by [Bun](https://bun.sh).

**Design system:** "Atelier Synthesis" — self-hosted fonts (Newsreader, Public Sans, IBM Plex Mono), four brand accents (`--amber`, `--red`, `--green`, `--blue`), dark/light + eco mode via `<body>` data attributes, everything scoped to `.acx`.

---

## Prerequisites

[Bun](https://bun.sh) ≥ 1.0.

---

## Quick start

```sh
git clone https://github.com/Fred-el-Jolo/fred-el-jolo.github.io
bun build
```

`dist/` is the built site. Open `dist/index.html` in a browser or run `bun dev` for a local server.

---

## Commands

| Command | What it does |
|---|---|
| `bun build` | Full build → `dist/` with atomic swap (safe if interrupted) |
| `bun new` | Scaffold a new article interactively |
| `bun components` | Print the component catalog to the terminal |
| `bun dev` | Local dev server on `localhost:3000`, rebuilds on file save |

---

## Writing an article

```sh
bun new
```

Prompts for title, slug, date, category, description, reading time, and AI provenance.
Creates `_articles/YYYY-MM-DD-slug/` with prefilled `meta.json`, starter `content.html`, and empty `assets/`.

**Authoring flow:**

1. Edit `_articles/{folder}/content.html` — article body only (no `<html>`, `<head>`, `<body>`, or header boilerplate)
2. Drop images into `_articles/{folder}/assets/` — reference them as `assets/file.jpg`
3. Fill in `_articles/{folder}/meta.json` — title, description, tags, reading time
4. Set `"status": "published"` when ready
5. `bun build` → generates `dist/articles/{slug}/index.html` with full SEO

Available components: `bun components` or open `_components/catalog.html` in a browser.

---

## meta.json fields

```json
{
  "title":               "Article title",
  "slug":                "url-slug",
  "date":                "YYYY-MM-DD",
  "category":            "dev env",
  "tags":                ["linux", "nix"],
  "description":         "One sentence, 155 chars max — used as meta description and in JSON-LD.",
  "readingTime":         9,
  "aiProvenance":        "none",
  "cover":               "cover.jpg",
  "coverAlt":            "Image alt text.",
  "coverFocus":          "50% 50%",
  "ecoCoverDescription": "Plain-text fallback shown instead of image in eco mode.",
  "featured":            false,
  "status":              "draft"
}
```

`category` must match a key in `_config/categories.json`: `linux` · `dev env` · `javascript` · `css / sass` · `raspberry pi` · `kubernetes`

`aiProvenance`: `"none"` (pencil icon) · `"enriched"` (star outline) · `"full"` (filled star)

---

## Build pipeline

`_scripts/build.ts` in order:

1. Load `_config/site.json` and `_config/categories.json`
2. Discover `_articles/*/meta.json` — skip `status: "draft"`
3. Sort newest → oldest
4. Copy `css/`, `js/`, `assets/`, `robots.txt` → `_dist_tmp/`
5. For each article: render `_templates/article.html`, inject canonical + OG + Twitter card + `BlogPosting` JSON-LD, copy `assets/`
6. Render `_templates/home.html` with generated featured section, article list, and `WebSite+Blog` JSON-LD
7. Write `sitemap.xml`
8. Atomic swap: `_dist_tmp/` → `dist/` (previous `dist/` survives on build failure)

---

## Project layout

```
_articles/        article source — one folder per article
  └── YYYY-MM-DD-slug/
      ├── meta.json       article metadata
      ├── content.html    article body only (goes inside <div class="col">)
      └── assets/         article images
_components/      catalog.html — visual reference for every component
_config/
  ├── site.json           site-wide config: url, author, social links
  └── categories.json     category definitions: label, color token, icon SVG
_scripts/
  ├── build.ts            build pipeline
  ├── new-article.ts      interactive scaffolder
  ├── dev.ts              local dev server
  └── list-components.ts  component catalog printer
_templates/
  ├── article.html        article page wrapper ({{PLACEHOLDER}} markers)
  └── home.html           home page template
css/                      atelier.css, prose.css (served verbatim)
js/                       atelier.js, prose.js, vendor/ (served verbatim)
assets/                   global: logo variants, monk illustrations
dist/                     built output (gitignored — deployed to GitHub Pages)
```

---

## SEO

Every article gets canonical, Open Graph, Twitter card, and `application/ld+json` (`BlogPosting` schema). The home page gets `WebSite + Blog` schema. `sitemap.xml` covers all published articles. `robots.txt` is static at project root.

---

## Adding a category

1. Add an entry to `_config/categories.json` with `label`, `color` (CSS var), `filterKey`, and `icon` (SVG path content)
2. Use the new key as `category` in article `meta.json`
3. `bun build`

---

## Deployment

The `dist/` directory is the deployable output. Options:

- **Manual:** run `bun build`, commit `dist/`, push — GitHub Pages serves from `dist/` or the repo root
- **GitHub Actions:** trigger `bun build` on push to `main`, deploy `dist/` to `gh-pages` branch
