# Ship — Atelier Synthesis

Everything in this folder is the **new site, ready to serve at the repo root** (plain static HTML,
no build step). Absolute paths (`/css/…`, `/assets/…`) are correct for `fred-el-jolo.github.io`.

## Contents
```
index.html               homepage (masthead, featured, post list, filter, footer)
article.html             reading view — "Nix flakes" sample post
article-components.html  the article component library / kitchen-sink post
css/atelier.css          site shell + design system (tokens, theme, eco, font-size)
css/prose.css            article component library (callouts, tables, code, highlights…)
js/atelier.js            theme / font-size / eco toggles (persisted) + punchline + tag filter
js/prose.js              copy buttons, heading anchors, sketch annotations
js/vendor/               sketch-annotate.js (self-hosted hand-drawn annotator)
css/fonts/               self-hosted Newsreader · Public Sans · IBM Plex Mono
assets/                  logos (light/dark) + colophon monks
```

## Land it on a new branch
From your local clone, with a clean working tree:

```bash
# base it on whatever you want (blog-v3 has your latest work)
git checkout blog-v3
git checkout -b atelier-synthesis

# clear the old site (you said you're dropping the old posts).
# review this — only remove what you actually want gone:
git rm -r --quiet posts css js images index.html about.html search.html aesthetecoding.xml 2>/dev/null || true

# copy the new site in (from this unzipped folder), then:
cp -R /path/to/this/site/. .

git add -A
git commit -m "Atelier Synthesis redesign: homepage, reading view, article component library"
git push -u origin atelier-synthesis
```

Open a PR (or push and review on GitHub). The branch won't be live until you point GitHub Pages at it
or merge to your published branch.

## Notes
- **Cover images — three tiers, one required.** Every post needs ONE wide `cover` (16:9); it's used
  for the article hero and as the fallback everywhere. Optionally add a `featured` image (its own
  composition for the À-la-une card) and/or a square `list` thumbnail. Point each slot at its specific
  image and give it `data-fallback` (the cover): if the specific file is missing, the image swaps to
  the cover automatically — so specific crops are purely optional.
  ```html
  <!-- FEATURED card: specific featured image, falls back to cover -->
  <div class="ph">
    <div class="cover"></div>
    <img class="cover-img" src="assets/posts/nix/featured.jpg"
         data-fallback="assets/posts/nix/cover.jpg" alt="…">
    <div class="ico">…eco icon…</div>
  </div>

  <!-- LIST thumb: specific square crop, falls back to cover (+ focal point) -->
  <img class="cover-img" src="assets/posts/nix/list.jpg"
       data-fallback="assets/posts/nix/cover.jpg" style="--focus:78% 40%" alt="">

  <!-- ARTICLE hero: the required cover -->
  <img class="cover-img" src="assets/posts/nix/cover.jpg" alt="…">
  ```
  `--focus:<x> <y>` sets the crop's focal point (default center) so a wide image reused in a square
  keeps its subject. Omit the `<img>` entirely → striped placeholder; eco mode hides all images and
  shows the topic icon. `assets/samples/` holds the three demo images used on the sample pages.
- **Fully local / zero third-party requests.** Fonts are self-hosted (`css/fonts/`, loaded via
  `@font-face` in `atelier.css`) and the hand-drawn annotations use a small self-contained drawer
  (`js/vendor/sketch-annotate.js`) — nothing is fetched from Google Fonts or any CDN at runtime.
- **Annotations** ([data-rough] on article text): animated sketchy underline / box / highlight, frozen
  to a static CSS fallback in eco mode / reduced-motion. The drawer is original code (not the npm
  rough-notation package), exposing the same small API.
- **New posts**: copy `article-components.html` as a template — it demonstrates every prose component.
- The three header toggles (theme / font-size / eco) persist to `localStorage`; an anti-flash snippet
  in each `<head>` applies the saved theme before first paint.
