---
name: blog-post
description: "Co-generates articles for aesthetecoding.io. Three workflows: Draft (full article from topic → meta.json + content.html), Outline (structure-first planning, then human approves before writing), Polish (improve an existing content.html for voice, flow, and component use). Knows the design system, the build pipeline format, and fred's editorial voice — spare, precise, field-notes style. USE WHEN: write article, draft post, blog post about X, new article about, post on X, outline article, plan article structure, polish draft, improve this article, edit this post, aesthetecoding, new post. NOT FOR: rewriting CLAUDE.md or build scripts; writing non-blog content."
effort: medium
disable-model-invocation: true
---

## Customization

**Before executing, check for customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/BlogPost/`

If found, load any `PREFERENCES.md` or `VOICE.md` there. These override defaults.

## 🚨 MANDATORY: Voice Notification

**Send BEFORE doing anything else.**

```bash
curl -sk -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running the WORKFLOWNAME workflow in BlogPost to ACTION", "voice_id": "102ymHTFEiUNJRyZ1qjb", "voice_enabled": true}' \
  > /dev/null 2>&1 &
```

# BlogPost Skill

Co-generates articles for aesthetecoding.io — a technical personal blog with a spare, field-notes voice.
The skill handles the full writing loop: from topic → structured HTML ready for `bun make`.

---

## Project Context

**Project root:** detected from cwd — must contain `_articles/` and `_config/`.

**Output location:** `_articles/{YYYY-MM-DD}-{slug}/`
- `meta.json` — structured metadata
- `content.html` — article body only (contents of `<div class="col">`)
- `assets/` — empty folder ready for images

**Build command:** `bun make` from project root — generates `dist/articles/{slug}/index.html`

**Component reference:** `_components/catalog.html` (visual) or `bun components` (terminal)

---

## Voice Profile

Derived from published articles in `_articles/`. Core fingerprint:

- **Lead with the point.** No windup. The first sentence says what the article is about.
- **Specific over vague.** Exact numbers (€420, 148 days, 60°C), exact tool names, exact commands.
- **One-liners that were earned.** Aphoristic conclusions after evidence, never before: "boring infrastructure is good infrastructure."
- **Second person, direct.** "You now have a Kubernetes cluster on your desk." Reader is present.
- **No hedging.** Drop "probably", "might", "could potentially". If uncertain, restructure the claim.
- **Callouts are practical and spare.** A tip is one actionable sentence. A warning names the exact failure mode.
- **Field notes, not tutorial.** "This is exactly what I bought" — not "here is the recommended approach".
- **Short sentences punctuate longer ones.** Vary rhythm. A punch after a compound sentence.

**What the voice never does:**
- Opens with "In this article, we will explore…"
- Writes "It is worth noting that…" or "It is important to understand…"
- Pads word count with restatements
- Uses rhetorical questions as section openers
- Credits the reader's intelligence with a reminder of what they already know

---

## Workflow Routing

| Workflow | Triggers | Action |
|---|---|---|
| **1. Outline** | "outline", "plan article", "structure post", "article structure" | Plan sections → human approves → write |
| **2. Draft** | "write article", "draft post", "blog post about", "new article", "post on" | Full article from topic → files |
| **3. Polish** | "polish", "improve article", "edit draft", "review this post" | Improve existing content.html |

---

## Gotchas

- **View every image before writing alt text or setting a `*Focus` value — never guess from filename or dimensions alone.** A default `"50% 50%"` can clip a subject that isn't actually centered; reading the pixels first is what catches it before it ships.
- **`featuredCover` and `listCover` are optional and blank by design in Draft's template — easy to forget they exist.** Nothing later in the pipeline re-surfaces them. If a home-page card crop matters for a given article, that's a manual follow-up to raise after Draft, not something the skill nudges toward on its own.
- **Draft's "review content.html" step is not a Polish pass.** Draft doesn't check voice, flow, or padding — invoke Polish explicitly when the content needs that pass; don't assume Step 7 already covered it.

---

## Category + Color Map

From `_config/categories.json`:

| Category key | Label | Color |
|---|---|---|
| `linux` | Linux | `--blue` |
| `dev env` | Dev Env | `--blue` |
| `javascript` | JavaScript | `--amber` |
| `css / sass` | CSS / Sass | `--red` |
| `raspberry pi` | Raspberry Pi | `--green` |
| `kubernetes` | Kubernetes | `--blue` |

---

## Content.html Format Rules

The file contains **only what goes inside `<div class="col">`**. Never include:
`<html>`, `<head>`, `<body>`, `<article>`, `<div class="rhead">`, `<div class="heroimg">`, `<div class="colo">`, `<footer>`, `<script>`.

**Component selection guidelines:**
- `.lead` — always the opening paragraph
- `.toc` — use when article has 3+ major sections
- `.tldr` — use for "here's what you'll get" articles (builds, setups); skip for opinion pieces
- `.callout--note` — context the reader needs before the next section
- `.callout--tip` — actionable shortcut discovered through use
- `.callout--warn` — the specific failure mode if they skip this
- `.terminal` — shell session with input/output; use `.cmd` and `.out` spans
- `.codeblock` — file content, multi-line config; always set `data-lang`
- `.steps` — numbered sequence where order is mandatory
- `.pullquote` — the article's central insight, used once maximum
- `.grid-2` — two contrasting perspectives side by side
- `.proscons` — explicit verdict sections
- `data-rough="highlight"` — a claim that surprised the author
- `data-rough="underline"` — a practical takeaway
- `data-rough="box"` — a key term being introduced
- `.post-tags` — always at the end; mirrors the article's tags
- `.footnotes` — for caveats and asides that would interrupt flow

**Paths in content.html:**
- Article images: `assets/filename.jpg` (relative — no leading slash)
- Other articles: `/articles/{slug}/` (root-relative)
- Site assets: `/assets/filename.png`
