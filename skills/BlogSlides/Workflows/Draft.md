# Draft Workflow

Generate a complete deck from a topic: creates `meta.json` + `slides.html` ready for `bun make`.

## When to invoke

- "make a slide deck about X"
- "slides about X"
- "draft a deck on X"
- "presentation post: X"

---

## Inputs

| Input | Required | Source |
|---|---|---|
| Topic / title | yes | User prompt |
| Angle / one-idea takeaway | no | User prompt or derived |
| Category | no | Inferred from topic, confirmed with user |
| Deck length | no | Default: 4-7 slides |
| Cover image | no | User provides filename, or omit |

---

## Step 1 — Clarify (if needed)

If the topic is vague, ask one or two targeted questions:

- What's the one idea the room should leave with?
- Is there an existing prose article this deck summarizes, or is it standalone?

Do not ask more than two questions. If the topic is specific enough, skip to Step 2.

---

## Step 2 — Load context

```bash
cat _config/categories.json
cat _config/site.json
ls _articles/
```

Read `_templates/article-deck.html` in full (every situation + its `data-speaker-notes`) before
picking which ones this deck needs.

---

## Step 3 — Plan the deck

Before writing, state the plan inline (not a file):

```
DRAFT PLAN
  Title:      [exact title]
  Slug:       [url-slug]
  Category:   [key from categories.json]
  Tags:       [3–6 tags]
  Angle:      [the one idea the room leaves with]
  Slides:     [list each situation in order, one line each]
  Length:     [slide count]
  Provenance: [none / enriched / full]
```

Pause here if fred confirms a plan is needed. Otherwise proceed immediately.

---

## Step 4 — Write slides.html

Write only `<section class="slide">` blocks — no `<html>`, `<head>`, `<body>`, or `<deck-stage>`
wrapper. Copy each slide's markup skeleton from `_templates/article-deck.html`, adapting the content
to this deck's topic. Rules:

- **Every slide needs `data-label="…"`** — this feeds the nav rail; make it short and distinct from
  the others (2-4 words).
- **Write `data-speaker-notes="…"`** on every slide — the explanation that would be said aloud, kept
  separate from what's shown. See SKILL.md § Voice for what belongs on-slide vs in the notes.
- **Never write page numbers by hand.** Use `<span data-deck-page></span>` in every footer — never
  `"01 / 06"` — `js/deck-stage.js` fills it in at runtime.
- **Full-Bleed Photo situation:** if using it, the image file must exist in `assets/` and you must
  view it before setting `--focus` — see Gotchas.
- **Don't use every situation.** Pick only what the approved plan calls for.

---

## Step 5 — Write meta.json

```json
{
  "title": "Exact deck title",
  "slug": "url-slug-no-date",
  "date": "YYYY-MM-DD",
  "category": "category key",
  "tags": ["tag1", "tag2", "tag3"],
  "description": "One sentence that tells the reader exactly what this deck covers. Under 155 chars.",
  "readingTime": N,
  "aiProvenance": "enriched",
  "format": "deck",
  "cover": "",
  "coverAlt": "",
  "coverFocus": "50% 50%",
  "ecoCoverDescription": "",
  "featured": false,
  "status": "draft"
}
```

`cover` here is for the home-page listing thumbnail (16:9) — independent of the deck's own internal
Cover slide, which can reuse the same image or use a different one entirely. Leave it blank for the
human to fill in later, same as `blog-post`. `featuredCover`/`listCover` work identically to a normal
article if the human wants dedicated home-page crops.

**`aiProvenance` decision:** same scale as `blog-post` — `"none"` (AI only structured, all phrasing
fred's), `"enriched"` (AI co-wrote, fred edited), `"full"` (AI generated with minimal human phrasing).
Default for this skill: `"enriched"`.

---

## Step 6 — Create files

```bash
mkdir -p _articles/YYYY-MM-DD-slug/assets
# Write meta.json first, then slides.html (use Write tool)
```

---

## Step 7 — Report

Output:

```
✓ _articles/{folder}/meta.json
✓ _articles/{folder}/slides.html
  _articles/{folder}/assets/    (empty — drop images here)

Next steps:
  1. Open the deck locally (bun make && bun dev) and click through it
  2. Add the cover image to assets/, fill cover/coverAlt/coverFocus (required, 16:9)
     — view the image before setting alt text or focus, don't guess
     — this is for the home-page listing thumbnail, separate from the deck's own Cover slide
  3. If a Full-Bleed Photo slide is used, view that image too before setting its --focus
  4. Set "status": "published" when ready
  5. bun make
```

Do NOT run `bun make` automatically — the draft needs human review first.
