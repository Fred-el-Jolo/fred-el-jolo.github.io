# Outline Workflow

Structure-first article planning. Produces a section-by-section plan with component choices
and a 2-sentence summary of each section. Fred approves (or edits) before any prose is written.

## When to invoke

- "outline an article about X"
- "plan the structure of a post on X"
- "article structure for X"
- "what sections should a post about X have"

---

## Step 1 — Gather topic

If not in the prompt, ask:
- What is the core claim or finding the article will make?
- Who is the reader (beginner to the topic, or already familiar)?

---

## Step 2 — Load context

```bash
cat _config/categories.json
ls _articles/
```

Read one related existing article to calibrate expected depth and structure.

---

## Step 3 — Generate outline

Output the outline in this format:

```
ARTICLE OUTLINE
───────────────────────────────────────────────────────────
Title:     [proposed title]
Category:  [key]
Slug:      [url-slug]
Tags:      [3–6 tags]
Length:    [estimated reading time]
Angle:     [what makes this worth reading — one sentence]

Lead:      [opening paragraph intention — 2 sentences]

───────────────────────────────────────────────────────────
SECTIONS
───────────────────────────────────────────────────────────

[h2 id]: Section Title                          [component(s) used]
  What this section covers in 1–2 sentences.
  Why it comes at this position in the sequence.

[h2 id]: Section Title                          [component(s) used]
  …

───────────────────────────────────────────────────────────
CLOSING
  Pros/cons or verdict?   [yes/no + why]
  Pull quote candidate:   [the article's central insight]
  Further reading:        [existing articles to link, if any]
  Post tags:              [same as above]
───────────────────────────────────────────────────────────
```

List every section. Include component intent (e.g. "terminal block for the install command",
"callout--warn for the cgroup gotcha"). This is what determines if the plan is good before writing.

---

## Step 4 — Wait for approval

After presenting the outline, stop. Do not write prose.

Ask: "Does this structure work, or should I adjust sections / angle / depth before writing?"

Once fred approves (any form of "yes", "go ahead", "looks good", "write it"), invoke the **Draft** workflow starting from Step 4 (skip Steps 1–3, use the approved outline).
