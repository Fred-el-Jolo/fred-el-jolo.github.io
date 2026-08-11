# Draft Workflow

Generate a complete article from a topic: creates `meta.json` + `content.html` ready for `bun make`.

## When to invoke

- "write an article about X"
- "draft a post on X"
- "blog post about X"
- "new article: X"

---

## Inputs

| Input | Required | Source |
|---|---|---|
| Topic / title | yes | User prompt |
| Angle / focus | no | User prompt or derived |
| Category | no | Inferred from topic, confirmed with user |
| Target length | no | Default: 8–12 min read (~1600–2400 words) |
| Cover image | no | User provides filename, or omit |

---

## Step 1 — Clarify (if needed)

If the topic is vague or the category is ambiguous, ask one or two targeted questions before proceeding:

- What's the specific angle? (gotchas you hit, comparison, build walkthrough, opinion)
- Is there one sentence that captures the point of the article?

Do not ask more than two questions. If the topic is specific enough, skip to Step 2.

---

## Step 2 — Load context

```bash
cat _config/categories.json
cat _config/site.json
ls _articles/
```

Read one or two existing `content.html` files from `_articles/` to calibrate voice.
Pick articles that are close in category or format to what you're about to write.

---

## Step 3 — Plan the article

Before writing, state the plan inline (not a file):

```
DRAFT PLAN
  Title:      [exact title]
  Slug:       [url-slug]
  Category:   [key from categories.json]
  Tags:       [3–6 tags]
  Angle:      [one sentence — what makes this article worth reading]
  Lead:       [opening sentence or two]
  Sections:   [list each h2 with 1-line description]
  Components: [which ones you'll use and why]
  Length:     [estimated reading time]
  Provenance: [none / enriched / full — based on how much AI-generated vs human voice]
```

Pause here if fred confirms a plan is needed. Otherwise proceed immediately.

---

## Step 4 — Write content.html

Write the full article body. Rules:

**Opening block:**
```html
<!-- Lead paragraph — sets the tone, no windup -->
<p class="lead">…</p>

<!-- TL;DR when the article is a build/setup walkthrough -->
<div class="tldr">
  <h4>TL;DR</h4>
  <ul>
    <li>…</li>
  </ul>
</div>

<!-- ToC when 3+ h2 sections -->
<nav class="toc" aria-label="On this page">
  <h4>On this page</h4>
  <ol>
    <li><a href="#slug">Section title</a></li>
  </ol>
</nav>
```

**Section headings:** use `id` attributes that match ToC anchors:
```html
<h2 id="the-slug">The Section</h2>
```

**Code and terminal:**
```html
<!-- Shell session (input + output) -->
<div class="terminal">
  <div class="terminal__bar"><i></i><i></i><i></i><span>context — shell</span></div>
  <pre><span class="cmd">command here</span><span class="out">output here</span></pre>
</div>

<!-- File content or multi-line code -->
<figure class="codeblock" data-lang="bash">
  <div class="codeblock__bar"><span class="codeblock__lang">bash</span><button class="codeblock__copy" type="button">Copy</button></div>
  <pre><code><span class="c"># comment</span>
command line</code></pre>
</figure>
```

**Callouts — use sparingly, one variant per article maximum:**
```html
<aside class="callout callout--note">
  <span class="callout__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 8h.01M11 12h1v4h1"></path></svg></span>
  <div class="callout__body">
    <p class="callout__title">Note</p>
    <p>…</p>
  </div>
</aside>

<aside class="callout callout--tip">
  <span class="callout__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .9 1.6h5.2c.1-.6.4-1.2.9-1.6A6 6 0 0 0 12 3Z"></path></svg></span>
  <div class="callout__body">
    <p class="callout__title">Tip</p>
    <p>…</p>
  </div>
</aside>

<aside class="callout callout--warn">
  <span class="callout__ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l9 16H3z"></path><path d="M12 10v4M12 17h.01"></path></svg></span>
  <div class="callout__body">
    <p class="callout__title">Watch out</p>
    <p>…</p>
  </div>
</aside>
```

**Inline annotations — use for 2–3 moments per article maximum:**
```html
<span data-rough="highlight" data-rough-color="amber">the surprising claim</span>
<span data-rough="underline" data-rough-color="green">the practical takeaway</span>
<span data-rough="box" data-rough-color="blue">key term</span>
```

**Pull quote — use once, for the article's central insight:**
```html
<p class="pullquote">The insight in one sentence.</p>
```

**Closing block — always end with:**
```html
<!-- Further reading (2 max, only if genuinely related articles exist) -->
<h3>Further reading</h3>
<div class="readmore">
  <a class="readmore-card" href="/articles/{slug}/"><span class="k">Category</span><h4>Title</h4></a>
</div>

<!-- Post tags — match meta.json tags -->
<div class="post-tags">
  <a href="#">tag one</a>
  <a href="#">tag two</a>
</div>
```

---

## Step 5 — Write meta.json

```json
{
  "title": "Exact article title",
  "slug": "url-slug-no-date",
  "date": "YYYY-MM-DD",
  "category": "category key",
  "tags": ["tag1", "tag2", "tag3"],
  "description": "One sentence that tells the reader exactly what they will learn. Under 155 chars.",
  "readingTime": N,
  "aiProvenance": "enriched",
  "cover": "",
  "coverAlt": "",
  "coverFocus": "50% 50%",
  "ecoCoverDescription": "",
  "featured": false,
  "status": "draft"
}
```

`cover` (16:9) is the only required image field — leave it blank for the human to fill in later, same
as today. Two more are optional and can be left out of the file entirely: `featuredCover` (5:4, for the
home page "À la une" card) and `listCover` (square, for the home page list-row thumbnail), each with a
matching `featuredCoverFocus` / `listCoverFocus`. Both fall back to `cover` automatically when omitted
or when the file is missing from `assets/` — don't add them unless the human asks for dedicated crops.

**`aiProvenance` decision:**
- `"none"` — AI only structured; all phrasing, examples, and voice are fred's
- `"enriched"` — AI co-wrote sections; voice checked and edited by fred
- `"full"` — AI generated the draft with minimal human phrasing

Default for this skill: `"enriched"`.

---

## Step 6 — Create files

```bash
# Create folder
mkdir -p _articles/YYYY-MM-DD-slug/assets

# Write files
# (use Write tool for meta.json and content.html)
```

Write `meta.json` first, then `content.html`.

---

## Step 7 — Report

Output:

```
✓ _articles/{folder}/meta.json
✓ _articles/{folder}/content.html
  _articles/{folder}/assets/    (empty — drop images here)

Next steps:
  1. Review content.html yourself — or run Polish for a dedicated voice/flow pass
  2. Add the cover image to assets/, fill cover/coverAlt/coverFocus (required, 16:9)
     — view the image before setting alt text or focus, don't guess
     — optionally add featuredCover / listCover crops for the home page cards, same rule
  3. Set "status": "published" when ready
  4. bun make
```

Do NOT run `bun make` automatically — the draft needs human review first.
