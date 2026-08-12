# Outline Workflow

Situation-first deck planning. Produces a slide-by-slide plan — which catalogue situation each slide
uses and why — before any slide markup gets written. Fred approves (or edits) the plan first.

## When to invoke

- "outline a deck about X"
- "plan the slides for X"
- "deck structure for X"
- "what slides should a deck about X have"

---

## Step 1 — Gather topic

If not in the prompt, ask:
- What is the one idea the room should leave with?
- Is this a short deck (one sitting, 4-6 slides) or a longer walkthrough (7+ slides, maybe with a
  Section Divider)?

---

## Step 2 — Load context

```bash
cat _config/categories.json
ls _articles/
```

Read `_templates/article-deck.html` (the slide catalogue) in full — every situation and its
`data-speaker-notes` needs to be fresh before picking which ones fit this topic.

---

## Step 3 — Generate the outline

```
DECK OUTLINE
───────────────────────────────────────────────────────────
Title:     [proposed title]
Category:  [key]
Slug:      [url-slug]
Tags:      [3–6 tags]
Angle:     [the one idea the room leaves with — one sentence]

───────────────────────────────────────────────────────────
SLIDES
───────────────────────────────────────────────────────────

1. [Situation name]                              data-label: "[label]"
   What this slide shows, in one line.
   Why this situation (not another) fits this moment.

2. [Situation name]                              data-label: "[label]"
   …

───────────────────────────────────────────────────────────
CLOSING SLIDE
  Situation:      Closing Ask, or a Full-Slide Quote if the deck ends on one line
  Outcome line:   [the single sentence that captures what the reader walks away with]
───────────────────────────────────────────────────────────
```

List every slide with its situation, not just a title — the situation choice is what determines
whether the plan actually works before any markup gets written. Resist reaching for every situation
in the catalogue; most decks land at 4-7 slides.

---

## Step 4 — Wait for approval

After presenting the outline, stop. Do not write slide markup.

Ask: "Does this structure work, or should I adjust slide count / situations / order before writing?"

Once fred approves, invoke the **Draft** workflow starting from Step 3 (skip Steps 1-2, use the
approved outline).
