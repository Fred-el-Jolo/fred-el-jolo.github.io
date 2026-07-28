# CLAUDE.md — aesthetecoding.io

Pure static HTML/CSS/JS blog. **No framework, no templating engine, no SASS compilation.**
Source lives in `_articles/`. Output is built to `dist/` by the bun make pipeline.

---

## Commands

```sh
bun make            # full build → dist/  (safe atomic swap)
bun new              # scaffold a new article interactively
bun components       # print the component catalog
bun dev              # local dev server (serves dist/ with file watching)
```

---

## Directory Structure

```
/
├── _articles/               # SOURCE — one folder per article
│   └── YYYY-MM-DD-slug/
│       ├── meta.json        # structured metadata (see schema below)
│       ├── content.html     # article body ONLY — contents of <div class="col">
│       └── assets/          # article-specific images (cover.jpg, etc.)
│
├── _components/
│   └── catalog.html         # living component reference — every UI element in one page
│
├── _config/
│   ├── site.json            # site-wide config: url, author, social links
│   └── categories.json      # category definitions: label, color token, icon SVG, filterKey
│
├── _scripts/
│   ├── build.ts             # main build pipeline
│   ├── new-article.ts       # interactive article scaffolder
│   └── list-components.ts   # component catalog printer
│
├── _templates/
│   ├── article.html         # full article page wrapper with {{PLACEHOLDER}} markers
│   ├── home.html            # home page template with {{PLACEHOLDER}} markers
│   └── meta.json            # metadata schema reference (annotated)
│
├── css/
│   ├── atelier.css          # design system — tokens, layout, components (scoped to .acx)
│   ├── prose.css            # reading column components — loaded on article pages only
│   └── fonts/               # self-hosted: Newsreader, Public Sans, IBM Plex Mono
│
├── js/
│   ├── atelier.js           # theme/font/eco toggles, tag filter, word rotation
│   ├── prose.js             # copy button, rough annotations, read progress
│   └── vendor/
│       └── sketch-annotate.js  # rough.js annotations (data-rough attribute)
│
├── assets/                  # global: logo variants, monk illustrations
│
├── dist/                    # BUILT OUTPUT — deployed to GitHub Pages (.gitignored locally)
│
├── robots.txt               # static
├── package.json             # bun scripts
└── article-components.html  # legacy design prototype (see _components/catalog.html)
```

---

## Article Authoring

### 1. Create a new article

```sh
bun new
```

Prompts for title, slug, date, category, description, reading time, AI provenance, cover image.
Creates `_articles/YYYY-MM-DD-slug/` with `meta.json`, `content.html`, and `assets/`.

### 2. Write the content

Edit `_articles/{folder}/content.html`. This file contains **only** what goes inside
`<div class="col">` — no `<html>`, `<head>`, `<body>`, or article `<header>` boilerplate.
The build wraps it in the full article template.

Start with the component catalog open in another tab:
```sh
bun components          # prints the catalog to terminal
open _components/catalog.html   # or: view in browser for full visual reference
```

### 3. Add images

Drop article images into `_articles/{folder}/assets/`. Reference them in content.html as:
```html
<img src="assets/my-image.jpg" alt="…">
```
The build copies `assets/` to `dist/articles/{slug}/assets/` verbatim.

### 4. Set metadata

Edit `_articles/{folder}/meta.json`. Required fields:

```json
{
  "title":               "Article title (used in <h1>, OG, JSON-LD)",
  "slug":                "url-slug",
  "date":                "YYYY-MM-DD",
  "category":            "dev env",
  "tags":                ["linux", "nix"],
  "description":         "One sentence, ≤155 chars — meta description + OG + JSON-LD.",
  "readingTime":         9,
  "aiProvenance":        "none",
  "cover":               "cover.jpg",
  "coverAlt":            "Alt text for the cover image.",
  "coverFocus":          "50% 50%",
  "ecoCoverDescription": "Plain-text shown instead of image in eco mode.",
  "featured":            false,
  "status":              "draft"
}
```

**`category`** — must match a key in `_config/categories.json`:
- `"linux"` | `"dev env"` | `"javascript"` | `"css / sass"` | `"raspberry pi"` | `"kubernetes"`

**`aiProvenance`**:
- `"none"` → "without AI" (pencil icon)
- `"enriched"` → "AI-enriched" (star outline)
- `"full"` → "with AI" (filled star)

**`cover`** — filename inside `assets/`; omit the key entirely for no cover image.

**`featured`** — set `true` on one article to pin it as the hero on the home page.
If none is featured, the most recent article takes the slot.

**`status`** — `"draft"` is never included in the build output. Change to `"published"` when ready.

### 5. Build and verify

```sh
bun make
```

Build writes to `_dist_tmp/`, validates, then atomically swaps: `dist/` → `_dist_old/`,
`_dist_tmp/` → `dist/`, then removes `_dist_old/`. If the build fails, `dist/` is untouched.

---

## Build Pipeline

`_scripts/build.ts` does the following in order:

1. Load `_config/site.json` and `_config/categories.json`
2. Discover `_articles/*/meta.json` — skip `status: "draft"`
3. Sort articles newest → oldest
4. Copy `css/`, `js/`, `assets/`, `robots.txt` → `_dist_tmp/`
5. For each article:
   - Render `_templates/article.html` substituting all `{{PLACEHOLDER}}` markers
   - Inject canonical URL, OG tags, Twitter card, `application/ld+json` (BlogPosting schema)
   - Copy `assets/` into `_dist_tmp/articles/{slug}/assets/`
   - Write `_dist_tmp/articles/{slug}/index.html`
6. Render `_templates/home.html`:
   - Generate `{{FEATURED_SECTION}}` from the featured article (or most recent)
   - Generate `{{ARTICLES_LIST}}` — sorted article rows
   - Generate `{{TOPICS_NAV}}` — category filter links
   - Inject `application/ld+json` (WebSite+Blog schema)
   - Write `_dist_tmp/index.html`
7. Write `_dist_tmp/sitemap.xml`
8. Atomic swap `_dist_tmp/` → `dist/`

### Template placeholders

`_templates/article.html` placeholders:

| Placeholder | Source |
|---|---|
| `{{PAGE_TITLE}}` | `meta.title + " — {aesthetecoding.io}"` |
| `{{META_DESCRIPTION}}` | `meta.description` |
| `{{HEAD_SEO}}` | canonical + OG + Twitter card + JSON-LD |
| `{{KICK_COLOR}}` | `categories[meta.category].color` (e.g. `--blue`) |
| `{{KICK_LABEL}}` | `categories[meta.category].label` |
| `{{ARTICLE_TITLE}}` | `meta.title` |
| `{{BYLINE_DATE}}` | formatted `meta.date` (e.g. "4 Jun 2026") |
| `{{BYLINE_READTIME}}` | `"9 min read"` |
| `{{PROVENANCE_BADGE}}` | generated badge HTML |
| `{{COVER_SECTION}}` | hero image + eco caption HTML, or empty string |
| `{{ARTICLE_BODY}}` | full content of `_articles/{folder}/content.html` |

`_templates/home.html` placeholders:

| Placeholder | Source |
|---|---|
| `{{HOME_SEO}}` | canonical + OG + JSON-LD |
| `{{TOPICS_NAV}}` | generated from `_config/categories.json` |
| `{{FEATURED_SECTION}}` | full featured article HTML block |
| `{{ARTICLE_COUNT}}` | total published articles |
| `{{ARTICLES_LIST}}` | generated `<a class="row">` elements |

---

## Design System

### CSS scope

All rules live in `atelier.css` and `prose.css`, scoped to `.acx` (on `<body>`).
State is carried by data attributes on `<body>`:
- `data-theme="dark|light"` — set by user toggle, persisted in `localStorage` as `acx-theme`
- `data-font="s|m|l"` — font scale, persisted as `acx-font`
- `data-eco="on|off"` — eco/performance mode, persisted as `acx-eco`

### Design tokens (CSS custom properties on `.acx`)

```css
/* brand accents */
--amber: #efa23c    --red: #e23b2e    --green: #37a14f    --blue: #1f9be0

/* type */
--news / --serif    Newsreader (display, headings, reading body)
--sans              Public Sans (UI elements)
--mono              IBM Plex Mono (code, meta, wordmark)

/* structure */
--maxw: 1060px      content max-width
--readw: 680px      reading column width
--pad: 40px         page side padding

/* radii */
--radius: 16px      large cards / covers
--radius-md: 12px   code blocks / hero image
--radius-sm: 8px    toggles
--radius-pill: 999px chips / tags / provenance badges

/* font scale (driven by data-font) */
--fs-scale: 1
```

### Key class names

| Class | Element | Purpose |
|---|---|---|
| `.acx` | `<body>` | Design system root — all rules scoped here |
| `.wrap` | div | Max-width container with side padding |
| `.mast` | `<header>` | Home page masthead |
| `.rbar` | `<header>` | Article reading bar (sticky) |
| `.rbar-in` | div | Reading bar inner flex row |
| `.brand` | `<a>` | Logo + wordmark link |
| `.wm` | `<span>` | `{ wordmark }` |
| `.seg` | div | Segmented control (theme / font toggles) |
| `.leaf` | `<button>` | Eco mode toggle |
| `.for-dark` / `.for-light` | `<img>` | Theme-conditional image |
| `.read` | `<article>` | Article container |
| `.rhead` | div | Article masthead: back link, kick, h1, byline |
| `.kick` | `<p>` | Category dot + label above h1 |
| `.byl` | div | Byline: author, date, read time |
| `.prov` | `<span>` | AI provenance badge |
| `.prov-none` | modifier | Pencil icon — "without AI" |
| `.prov-enriched` | modifier | Star outline — "AI-enriched" |
| `.prov-full` | modifier | Filled star — "with AI" |
| `.heroimg` | div | Cover image wrapper |
| `.ph` | div | Placeholder / image host (uses `--focus` for focal point) |
| `.cover-img` | `<img>` | Cover image (object-fit crop) |
| `.eco-cap` | div | Eco-mode text shown instead of image (`data-eco="on"`) |
| `.col` | div | Article reading column — CSS grid layout |
| `.colo` | div | End-of-article colophon |
| `.foot` | `<footer>` | Page footer |
| `.list` | div | Article row list (home page) |
| `.row` | `<a>` | Single article row; `--cat` CSS var sets accent; `data-cat` drives filter |
| `.thumb` | div | Article thumbnail in row |
| `.ico` | div | Category icon overlay on thumbnail |
| `.mid` | div | Title + meta in row |
| `.feat` | div | Featured article block |
| `.feat-wrap` | `<section>` | Featured block outer wrapper |
| `.eyebrow` | `<p>` | "À la une" label above featured title |
| `.cta` | `<a>` | Featured article CTA button |
| `.sec` | div | Section header: title + count + rule |
| `.ct` | `<span>` | Article count chip in section header |
| `.mast-topics` | `<nav>` | Category filter nav (home page) |

### Article prose classes (prose.css, inside `.read .col`)

| Class | Tag | Notes |
|---|---|---|
| `.lead` | `<p>` | Opening paragraph — larger serif, dimmed |
| `.toc` | `<nav>` | On this page — h4 + ol |
| `.tldr` | div | TL;DR box |
| `.callout.callout--note/tip/warn` | `<aside>` | Callout variants |
| `.table-wrap` | div | Horizontally scrollable table wrapper |
| `.fig.fig--right` | `<figure>` | Right-floated figure; `style="--w:300px"` |
| `.terminal` | div | Terminal block with macOS bar |
| `.codeblock` | `<figure>` | Code block with lang label + copy button; `data-lang="bash"` |
| `.steps` | `<ol>` | Numbered steps with h4 headings |
| `.pullquote` | `<p>` | Large display pull quote |
| `.grid-2` | div | Two equal columns |
| `.proscons` / `.pros` / `.cons` | div | Pros & cons side-by-side |
| `.divider-orn` | div | Ornamental `◇` section divider |
| `.readmore` | div | Further reading card grid |
| `.readmore-card` | `<a>` | Individual reading card |
| `.footnotes` | `<section>` | Footnotes section with ol |
| `.post-tags` | div | Tag chip list |
| `.hl` | `<span>` | Inline amber highlight; `.hl--green` for green |
| `.fn-ref` | `<a>` | Footnote reference superscript link |

### Rough annotations (`js/vendor/sketch-annotate.js`)

Add to any inline element:
```html
<span data-rough="highlight" data-rough-color="amber">text</span>
<span data-rough="underline" data-rough-color="green">text</span>
<span data-rough="box"       data-rough-color="blue">text</span>
```
Colors: `amber` | `green` | `blue` | `red`

### Code block syntax spans

Inside `.codeblock pre > code` and `.terminal pre`:
```html
<span class="c">/* comment */</span>
<span class="k">keyword</span>
<span class="s">"string"</span>
<span class="cmd">shell command</span>   <!-- terminal only -->
<span class="out">output line</span>    <!-- terminal only -->
```

---

## SEO

Every article page gets (injected by build pipeline):

- `<link rel="canonical">` — `https://aesthetecoding.io/articles/{slug}/`
- Open Graph: `og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `og:site_name`, `article:published_time`, `article:section`, `article:tag`
- Twitter card: `summary_large_image`
- `<script type="application/ld+json">` — `BlogPosting` schema with author, publisher, image, keywords

Home page gets:
- OG + Twitter card
- `<script type="application/ld+json">` — `WebSite + Blog` schema

`sitemap.xml` is generated at `dist/sitemap.xml` with all published article URLs.
`robots.txt` (static at project root) is copied verbatim.

To add a new category (affects nav, icon, color, and filter):
1. Add an entry to `_config/categories.json`
2. Use the new key as `meta.category` in articles
3. Run `bun make`

---

## Adding / Changing Content

| Task | What to do |
|---|---|
| New article | `bun new` then edit content.html |
| Change home page layout | Edit `_templates/home.html` — rebuild |
| Change article page wrapper | Edit `_templates/article.html` — rebuild |
| Add a category | Edit `_config/categories.json` — rebuild |
| Edit site title / URL / social | Edit `_config/site.json` — rebuild |
| Add a CSS component | Edit `css/prose.css` (article) or `css/atelier.css` (site-wide) |
| Add a JS behavior | Edit `js/prose.js` (article) or `js/atelier.js` (site-wide) |
| View all components | `bun components` or open `_components/catalog.html` in browser |

## Invariants

- **No Jekyll, no Liquid, no SASS compilation.** CSS is written and served as-is.
- **No npm/npx.** Use `bun`/`bunx` only.
- **Root-relative paths in templates.** `/css/atelier.css`, `/js/atelier.js`, `/assets/logo.png` — not `../../`.
- **Article assets are relative.** Inside content.html: `assets/cover.jpg` (no leading slash) — they're in the same served folder.
- **Never modify `dist/` by hand.** It's generated. Always edit source files and rebuild.
- **`_templates/` placeholders are `{{UPPERCASE_NAME}}`.** The build does `.replaceAll(...)` — don't rename without updating `_scripts/build.ts`.
- **`content.html` is article body only.** Never include `<html>`, `<head>`, `<body>`, `<article>`, or the `.rhead` block — those come from the template.
