# Polish Workflow

Improves an existing `content.html` draft for voice consistency, flow, component usage,
and technical precision. Edits in place; explains every change.

## When to invoke

- "polish this article"
- "improve this draft"
- "edit content.html"
- "review this post"
- "make this sound more like me"

---

## Step 1 — Locate the draft

If a folder name or slug is given, read:
```bash
cat _articles/{folder}/content.html
cat _articles/{folder}/meta.json
```

If not given, ask which article to polish.

---

## Step 2 — Calibrate voice

Read one published article from `_articles/` that is in the same category or similar tone.
This gives the baseline — the polish target is consistency with what already works.

---

## Step 3 — Assess the draft

Before making any edits, produce a short assessment (max 8 bullets):

```
DRAFT ASSESSMENT
  Voice:      [consistent / drifts in section X / too formal / too casual]
  Flow:       [reads well / [section] feels out of order / transition missing after [section]]
  Components: [well chosen / [component] is forced / missing a [component] for [moment]]
  Lead:       [lands / too slow / buries the point]
  Specificity:[good / section X is too vague — no numbers/examples]
  Technical:  [accurate / [claim] needs verification]
  Length:     [right / padded in [section] / section X too thin]
  Quick wins: [the 2–3 changes with highest ROI]
```

---

## Step 4 — Apply edits

Apply all changes to the file. For each significant change, include an inline HTML comment
explaining what changed and why:

```html
<!-- polish: lead rewritten — original opened with context instead of the point -->
<p class="lead">…</p>
```

**What to fix (in priority order):**

1. **Voice breaks** — AI-flavored sentences ("It is important to note…", "This approach ensures…"). Rewrite to match the field-notes fingerprint.
2. **Missing specifics** — Replace vague claims ("it works well", "this is fast") with measurements, version numbers, or concrete examples.
3. **Lead weakness** — If the opening doesn't land in one or two sentences, rewrite it.
4. **Component gaps** — If a callout, terminal block, or code block would make a section clearer, add it. If a component is forced (using `.pullquote` for something unremarkable), remove it.
5. **Flow issues** — Reorder sections if the sequence isn't logical. Add transition sentences where sections feel disconnected.
6. **Padding** — Remove sentences that restate what was just said. Remove rhetorical questions used as section transitions. Remove "In conclusion…" style closings.
7. **Technical accuracy** — Flag (don't fix without verification) any commands, version numbers, or technical claims that may be wrong.

---

## Step 5 — Update meta.json if needed

If the polish significantly changed the angle or reading time, update `meta.json`:
- `readingTime` — re-estimate
- `description` — update if the article's point shifted
- `aiProvenance` — if the polish was heavy, consider bumping from `"none"` to `"enriched"`

---

## Step 6 — Report

After writing the edited file:

```
POLISH COMPLETE — _articles/{folder}/content.html

Changes made:
  • [what changed] — [why]
  • [what changed] — [why]
  …

Flags for manual review:
  • [technical claim at line N that needs verification]
  • [section that may need a cover image or figure]
```

Do not say "the article now reads well" or similar self-assessments. State what changed.
