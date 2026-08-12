---
name: blog-slides
description: "Co-generates slide-deck articles for aesthetecoding.io — the slide-format sibling of blog-post. Three workflows: Outline (pick slide situations + order from the catalogue, human approves before writing), Draft (full deck from topic → meta.json + slides.html), Polish (voice/pacing pass on an existing slides.html). Knows the slide catalogue (_templates/article-deck.html), the deck build pipeline (_templates/deck.html, css/deck.css, js/deck-stage.js), and fred's spare field-notes voice adapted for speaker-note fragments. USE WHEN: make a slide deck, deck article, slides about X, presentation post, turn this into slides, outline a deck, draft a deck, polish these slides, slide-format article, aesthetecoding deck. NOT FOR: prose articles (use blog-post); rewriting CLAUDE.md, build scripts, or the deck system itself (css/deck.css, js/deck-stage.js, _templates/deck.html)."
version: 1.0.0
disable-model-invocation: true
---

## Customization

**Before executing, check for customizations at:**
`~/.claude/LIFEOS/USER/CUSTOMIZATIONS/SKILLS/BlogSlides/`

If found, load any `PREFERENCES.md` or `VOICE.md` there. These override defaults.

## 🚨 MANDATORY: Voice Notification

**Send BEFORE doing anything else.**

```bash
curl -sk -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running the WORKFLOWNAME workflow in BlogSlides to ACTION", "voice_id": "102ymHTFEiUNJRyZ1qjb", "voice_enabled": true}' \
  > /dev/null 2>&1 &
```

# BlogSlides Skill

Co-generates slide-deck articles for aesthetecoding.io — the slide-format sibling of `blog-post`.
Same blog, same voice, different medium: a full-page, keyboard-navigable deck instead of a
reading-column article.

---

## Project Context

**Project root:** detected from cwd — must contain `_articles/` and `_config/`.

**Output location:** `_articles/{YYYY-MM-DD}-{slug}/`
- `meta.json` — structured metadata, `"format": "deck"`, otherwise identical to a normal article
- `slides.html` — `<section class="slide">` blocks ONLY, no wrapper (same "body only" contract as
  `content.html` for prose articles)
- `assets/` — empty folder ready for images

**Build command:** `bun make` from project root — renders via `_templates/deck.html`, generates
`dist/articles/{slug}/index.html`

**The slide catalogue — read before every Outline or Draft:** `_templates/article-deck.html`. It
holds every slide situation this deck system supports, each with worked example content: Cover,
Section Divider, Two-Column Cards, Code Panel + Numbered Flow, Terminal, Comparison Table + Side
Card, Cards with "OR" Divider, Full-Bleed Photo, Full-Slide Quote, Closing "Ask". Open it directly
in a browser, or read the file — it is a reference to copy individual `<section>`s FROM, never a
checklist a deck must complete.

**Do not confuse `_templates/article-deck.html` with `_templates/deck.html`** — the first is the
browsable catalogue (never read by `build.ts`), the second is the actual production template.

---

## Voice — adapted for the slide medium, not prose

A slide is not a paragraph. It's the on-screen prompt for what gets said aloud — `data-speaker-notes`
carries the explanation, the slide itself carries only the fragment the room needs to see. The
catalogue's own worked examples ARE the voice doctrine; read them as instructions, not filler:

- **Fragments over sentences.** "The single sentence you want the room to remember" (Quote slide) —
  a slide title is a phrase, not a claim with a subject and verb padding it out.
- **State the ask and the refusal in the same breath.** "State exactly what you want and what you
  are NOT asking for" (Closing slide) — every deck should be able to name what it's NOT claiming,
  not just what it is.
- **Let content carry weight without narration.** "Let this sit. Don't talk over it" (Quote slide
  notes) and "Let the image carry the moment — the caption is a label, not a paragraph" (Photo slide
  notes) — resist the urge to over-explain a slide that's already doing its job.
- **Numbers and structure over adjectives** — the Comparison Table and Numbered Flow situations exist
  because a claim backed by a table beats a claim backed by enthusiasm.
- **One idea per slide.** If a slide needs two `<h2>`-worthy ideas, it's two slides.

**What the voice never does on a slide:** a full paragraph of body text, a bullet list longer than
what the room can read in the time it takes to say the accompanying sentence, or a title that
restates the previous slide's title with "(cont.)".

---

## Workflow Routing

| Workflow | Triggers | Action |
|---|---|---|
| **1. Outline** | "outline a deck", "plan slides", "deck structure" | Pick situations + order from the catalogue → human approves → write |
| **2. Draft** | "make a deck", "slides about X", "draft slides", "presentation post" | Full deck from topic → meta.json + slides.html |
| **3. Polish** | "polish these slides", "improve this deck", "tighten these slides" | Voice/pacing pass on existing slides.html |

---

## Gotchas

- **The catalogue is not a checklist.** `_templates/article-deck.html` demonstrates ten slide
  situations so there's a worked example for whatever a deck needs — it does not mean a deck needs
  ten slides, or any specific subset. Most decks use 4-7 situations. Padding a deck with unused
  situations to "use the catalogue fully" is the single most common way to make a bad deck.
- **`_templates/article-deck.html` vs `_templates/deck.html` — read the file name before editing.**
  The catalogue is a browsable reference, never touched by `build.ts`. The production template is
  what actually renders. Confusing the two means editing a file nobody's build ever reads.
- **Never hand-write `[data-deck-page]` content.** It's an empty `<span>` — `js/deck-stage.js` fills
  it with `"NN / total"` automatically at runtime. Writing a number into it (e.g. `"03 / 06"`) just
  creates a value the script immediately overwrites, and it drifts the instant slide count changes
  during drafting.
- **View every image before setting `--focus` on a `.slide--photo` situation — never guess.** Same
  lesson `blog-post` learned this session: a default `50% 50%` can clip the actual subject of a wide
  photo when the slide's 16:9 frame crops it. Read the pixels first.
- **`data-speaker-notes` is stored but not yet surfaced anywhere** — there is no presenter view. Write
  them anyway (they're the voice doctrine for that slide and free future work), but don't promise the
  reader or author a feature that doesn't exist yet.
- **`meta.json` fields are otherwise identical to a normal `blog-post` article** — `cover`/
  `featuredCover`/`listCover` still drive the home-page listing thumbnails and are independent of
  whatever image appears on the deck's own Cover slide. Don't skip them assuming the deck's internal
  cover slide substitutes for the site's listing thumbnail — it doesn't.

---

## Slide Situation Reference

| Situation | CSS entry point | Use for |
|---|---|---|
| Cover | `.slide--gradient` + `.title--hero` | Deck opener — title, kicker, one-line tagline |
| Section Divider | `.slide--dark.slide--divider` | A breath between parts of a longer deck |
| Two-Column Cards | `.card` × 2 in a `.row` | Comparing or pairing two related ideas |
| Code + Flow | `.tree` + `.flow` | A file/folder structure paired with a process |
| Terminal | `.terminal` | A shell session — input + output, deck-native `.terminal` port |
| Comparison Table + Side | `.table` + side panel | A claim a table backs up, plus supporting context |
| Cards + OR | `.card` × 2 + `.or` | Two genuinely alternative paths from one foundation |
| Full-Bleed Photo | `.slide--photo` | Let an image carry a moment — view it first, set `--focus` |
| Full-Slide Quote | `.deck-quote` | The one sentence the room should remember |
| Closing Ask | `.slide--dark` + `.banner` | What holds / what doesn't / the outcome line |

---

## Examples

**Example 1: Draft a deck from a topic**
```
User: "Make a slide deck about the Pi cluster build"
→ Invokes Draft workflow
→ Picks 5-6 relevant situations from the catalogue (Cover, Photo, Table, Flow, Closing Ask)
→ Writes meta.json ("format": "deck") + slides.html
→ Reports next steps — does not run bun make automatically
```

**Example 2: Outline first for a longer deck**
```
User: "Outline a deck comparing three self-hosting options"
→ Invokes Outline workflow
→ Proposes situation order (Cover → Table+Side → Cards+OR → Closing Ask)
→ Stops for approval before writing any slide
→ On approval, continues into Draft using the approved outline
```

**Example 3: Polish an existing deck**
```
User: "Polish the slides.html in the homelab deck"
→ Invokes Polish workflow
→ Assesses each slide against the fragment-not-sentence voice standard
→ Tightens overlong titles, moves explanation into data-speaker-notes
→ Reports what changed, flags anything needing fact-check
```
