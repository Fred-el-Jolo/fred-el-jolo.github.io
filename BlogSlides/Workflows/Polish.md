# Polish Workflow

Improves an existing `slides.html` draft for voice, pacing, and situation fit. Edits in place;
explains every change.

## When to invoke

- "polish these slides"
- "improve this deck"
- "tighten these slides"
- "review this deck"

---

## Step 1 — Locate the draft

```bash
cat _articles/{folder}/slides.html
cat _articles/{folder}/meta.json
```

If no folder/slug given, ask which deck to polish.

---

## Step 2 — Calibrate voice

Read `_templates/article-deck.html` again — the catalogue's own `data-speaker-notes` are the voice
baseline (fragments over sentences, one idea per slide, let content carry weight without narration).
The polish target is consistency with that standard, not with prose-article voice.

---

## Step 3 — Assess the draft

Before making any edits, produce a short assessment (max 8 bullets):

```
DECK ASSESSMENT
  Voice:       [fragments throughout / slide N reads like a paragraph]
  Pacing:      [one idea per slide / slide N is doing two jobs, split it]
  Situations:  [well chosen / situation on slide N is forced, doesn't fit the content]
  Labels:      [all data-label distinct and short / slide N's label is vague or duplicated]
  Notes:       [speaker notes carry the explanation / slide N has no notes and needed them]
  Page numbers:[all use <span data-deck-page></span> / slide N has a hand-written number — fix]
  Closing:     [lands on one clear outcome / closing slide is vague]
  Quick wins:  [the 2-3 changes with highest ROI]
```

---

## Step 4 — Apply edits

Apply all changes to the file. For each significant change, include an inline HTML comment:

```html
<!-- polish: title was a full sentence — cut to the fragment the room reads in a glance -->
<h2 class="title">…</h2>
```

**What to fix, in priority order:**

1. **Sentence-shaped titles** — a slide title reading like a complete sentence with a subject and
   verb almost always wants to be a fragment; move the explanation into `data-speaker-notes`.
2. **Two ideas on one slide** — split into two slides rather than cramming a second `<h2>`-worthy
   point under one heading.
3. **Hand-written page numbers** — replace any literal `"NN / total"` text with
   `<span data-deck-page></span>`.
4. **Forced situations** — if a situation (e.g. Comparison Table) doesn't actually have two things
   to compare, swap it for one that fits what the content is actually doing.
5. **Missing or thin speaker notes** — a slide with a claim but no `data-speaker-notes` is asking the
   presenter to improvise; add the explanation that belongs there.
6. **Vague or duplicate `data-label`s** — the nav rail is only useful if labels are distinct.
7. **Padding to use more of the catalogue** — if a slide doesn't earn its place, cut it rather than
   keep the deck "complete."

---

## Step 5 — Update meta.json if needed

If the polish changed the deck's scope or slide count meaningfully:
- `readingTime` — re-estimate (a deck reads faster than prose; count ~15-20s per slide)
- `description` — update if the angle shifted
- `aiProvenance` — bump toward `"enriched"` if the polish pass was substantial

---

## Step 6 — Report

```
POLISH COMPLETE — _articles/{folder}/slides.html

Changes made:
  • [what changed] — [why]
  • [what changed] — [why]
  …

Flags for manual review:
  • [technical claim at slide N that needs verification]
  • [image on a Full-Bleed Photo slide that needs viewing before --focus is finalized]
```

Do not say "the deck now flows well" or similar self-assessments. State what changed.
