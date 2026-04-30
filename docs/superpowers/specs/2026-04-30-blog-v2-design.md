# aesthetecoding.io — Blog v2 Design Spec

**Date:** 2026-04-30
**Branch:** blog-v2
**Status:** Approved — ready for implementation

---

## 1. Goals

Finish the blog v2 refactor. Deliver:
1. A consistent article list with full card metadata
2. A reusable post template page
3. A dead-simple interactive post creation script
4. A fully static output — no backend, no build pipeline

---

## 2. Constraints

- HTML + CSS + JS only. Every line must have a purpose.
- Mobile-first. Desktop and 4K are progressive enhancements via media queries.
- Single CSS file (`public/css/main.css`). No preprocessors.
- No external CSS/JS frameworks or CDN dependencies.
- No build step for authoring. `new-post.sh` is local tooling, not a pipeline.

---

## 3. File Structure

```
fred-el-jolo.github.io/
├── index.html                          ← article list (patched by script)
├── public/
│   ├── css/
│   │   ├── main.css                    ← single CSS file, extended
│   │   └── fonts/                      ← self-hosted Ubuntu, Source Sans 3, Source Code Pro
│   ├── js/
│   │   └── main.js                     ← extended: tag filter, theme persist, reading time
│   ├── images/                         ← site-wide icons and logos (unchanged)
│   └── posts/
│       └── YYYY-MM-DD-slug/
│           ├── index.html              ← post page, copied from template
│           ├── cover.{jpg|png|webp}    ← main illustration (optional)
│           └── *.{jpg|png|webp|gif}    ← additional in-post assets
└── scripts/
    ├── new-post.sh                     ← interactive creation script
    └── post-template.html              ← post page template
```

### Files and folders to remove entirely

- `_posts/` — Jekyll markdown sources
- `_includes/` — Jekyll includes
- `_layouts/` — Jekyll layouts
- `_sass/` — legacy Sass
- `src/` — abandoned Vite/TypeScript source
- `tsconfig.json`
- `package.json`, `package-lock.json`, `node_modules/`
- `public/posts/thumbnails/` — thumbnails migrate into post slug folders
- Old nested-date post folders (`public/posts/2020/01/02/…`) — migrated or removed

---

## 4. Article Card (index.html)

### Structure

```html
<article data-tags="javascript async guide">
  <ul class="tags">
    <li><a href="#" data-tag="javascript">javascript</a></li>
    <li><a href="#" data-tag="async">async</a></li>
  </ul>
  <a href="/posts/YYYY-MM-DD-slug/">
    <div class="article-illustration">
      <img src="/posts/YYYY-MM-DD-slug/cover.jpg" alt="" width="300" height="200">
    </div>
    <div>
      <h2>Title</h2>
      <div class="subtitle-bar">
        <span class="article-date"><img src="…/calendar-alt-svgrepo-com.svg"> 14 Mar 2019</span>
        <span class="reading-duration"><img src="…/hourglass-svgrepo-com.svg"> 12 min</span>
      </div>
      <p>Abstract text, clamped to 3 lines.</p>
    </div>
  </a>
</article>
```

### Layout

- **Mobile (default):** column — illustration on top, text below
- **Desktop (≥768px):** row — illustration fixed at 160×120px left, text flex-grows right
- **4K / HD:** `<main>` constrained to `max-width: 1200px`, centered with `margin: 0 auto`

### Tags overlay

- `position: absolute`, top-right of card, overlaid on the illustration
- Semi-transparent dark brown background (`rgba(51,31,0,0.70)`)
- White text, pipe-separated

### Interactions

- Hover: shadow lifts (`box-shadow` transition)
- Tag click: client-side filter — hides non-matching `<article>` elements
- Active tag: highlighted style on the `<a>` element
- Clicking active tag again (or an "All" control) resets the filter
- The "All" control is a pill badge (same style as tag badges) labeled "All", rendered before the article list; active by default
- `<article data-tags="…">` is the filter hook — space-separated tag list

### Image formats

Any of `.jpg`, `.png`, `.webp`. The `<img>` tag accepts whichever is present.

---

## 5. Post Template Page

### Layout order (top to bottom)

```
┌─────────────────────────────────────┐
│  header bar  (68px, dark brown)     │
│  [monk logo + site name]  [← All]  │
├─────────────────────────────────────┤
│  cover image  (full width, 240px)   │
├─────────────────────────────────────┤
│  hero  (white bg, 24px padding)     │
│  Title (large, bold, dark brown)    │
│  📅 date · ⏱ time  [tag] [tag]    │
├─────────────────────────────────────┤
│  body  (40px top padding)           │
│  paragraphs, h2, h3, pre, bq, img  │
├─────────────────────────────────────┤
│  footer  (dark brown, centered)     │
└─────────────────────────────────────┘
```

### Header bar

- Height: 68px, background `#331f00`
- Left: `logo-couleur-contourblanc.png` at 56px height + `{aesthete` **coding** `.io}` text (orange braces, white text)
- Right: `← All articles` link in muted white, links to `/`
- No border-radius on the page wrapper

### Cover image

- Full-width `<img>`, `object-fit: cover`, `max-height: 240px`
- Optional — if no cover, the `<img>` element is omitted; hero section sits directly below header. In the article card, the `.article-illustration` div is also omitted when no cover is present.
- Accepts `.jpg`, `.png`, `.webp`

### Hero section

- `padding: 24px 28px 0` — no bottom border or separator line
- Title: `font-size: 2.8rem`, `font-weight: 800`, color `#331f00`
- Meta row: `display: flex; justify-content: space-between`
  - Left: `📅 date · ⏱ N min`
  - Right: tags as pill badges (dark brown bg, white text, border-radius 12px)

### Body section

- `padding-top: 40px` — breathing room, no separator line needed
- Content width `max-width: 720px`, centered with `margin: 0 auto`
- `h2`: `border-bottom: 2px solid #ffa31a` (orange accent)
- `h3`: no border, weight 600
- `pre > code`: dark background (`#1e1e1e`), Source Code Pro font
- `blockquote`: `border-left: 4px solid #ffa31a`, warm cream background
- `figure > img`: full width, `border-radius: 6px`
- `figure > figcaption`: small, centered, italic, muted color

### Post page assets

All images referenced in the post body use relative paths (e.g. `<img src="event-loop.png">`). All assets live in the post's slug folder alongside `index.html`.

---

## 6. Post Creation Script (`scripts/new-post.sh`)

### Invocation

```sh
./scripts/new-post.sh
```

No arguments required. Fully interactive.

### Prompt flow

```
Title:          <free text>
Slug:           <auto-derived from title, user can edit>
Tags:           <comma-separated; shows existing tags as hints>
Abstract:       <one-line description>
Reading time:   <integer minutes>
Cover image:    <filename, e.g. cover.png — leave blank to skip>
                → tells user exact path to place the file

[card preview printed]

Create? [Y/n]
```

### Actions on confirm

1. Create `public/posts/YYYY-MM-DD-{slug}/index.html` copied from `scripts/post-template.html`, with all fields substituted
2. Insert a new `<article>` card at the top of `<main>` in `index.html`
3. Print confirmation with file paths
4. Open the new post in `$EDITOR`

### Slug derivation

Lowercase title, spaces → hyphens, strip non-alphanumeric (except hyphens). Example: `"Mastering CSS Grid!"` → `mastering-css-grid`.

### Tag hints

Script reads existing `data-tags` attributes from `index.html` to build the hint list shown during the Tags prompt.

---

## 7. Legacy Post Migration

### Rule

Attempt to migrate every post in `_posts/` to the new HTML format in `public/posts/YYYY-MM-DD-slug/`.

- **Markdown posts** → convert content to HTML, wrap in `post-template.html`
- **HTML posts** → migrate as-is, copying all assets from the old folder
- **Posts with unresolvable JS lib errors** at migration time → silently skip; no card added to `index.html`

Assets (images, etc.) from old locations (`public/posts/thumbnails/`, `public/posts/2020/…`) migrate into the new slug folder.

### Known complex posts (likely skip candidates)

- `2019-03-14-asynchronous-js` — reveal.js presentation
- `2018-12-09-mathjax` — MathJax library (may work via CDN reference; attempt first)

---

## 8. CSS Additions (`main.css`)

Additions to existing sections — no rewrites.

| Addition | Details |
|---|---|
| `html { font-size: 62.5% }` | Restores the intentional 1rem=10px base |
| Body dark-mode | `body.dark-theme` — bg `#1a1207`, text `#e8d5b0`, card bg adjusted |
| Body light-mode | `body.light-theme` — explicit light override for system-dark users |
| HD/4K container | `main { max-width: 1200px; margin: 0 auto }` |
| Desktop article row | `@media (≥768px)` — flex row, image 160×120, text flex-grows |
| `.postDetail` | All post page styles (hero, body, cover, footer) |
| Tag filter active | `.tags li a.active { background: #ffa31a; color: #331f00 }` |
| `body.dys-font` | Ubuntu font, increased letter-spacing and line-height |
| `body.eco-mode` | Hide `.article-illustration`, remove box-shadows, show border instead |

---

## 9. JS Additions (`main.js`)

Additions to existing toggle handlers.

| Addition | Details |
|---|---|
| `localStorage` persistence | Save/restore `dark-theme`, `light-theme`, `dys-font`, `eco-mode` on page load |
| Tag filter | Click `[data-tag]` → toggle `active` class, filter `<article data-tags>` elements |
| Filter reset | Click active tag again, or a generated "All" control, to show all articles |
| Reading time (post pages) | Count words in `.post-body`, display in the meta row `<span>`. This is the actual calculated value; the article card shows the estimate entered at creation time — minor differences are acceptable. |

---

## 10. Out of Scope

- Tag pages (`/tags/javascript.html`) — deferred; revisit when post count grows
- Search page (`search.html`) — not part of this refactor
- Comments, RSS feed, sitemap — not part of this refactor
- Syntax highlighting library (Prism.js etc.) — posts use inline `<pre><code>` with manual spans if needed; no library added
