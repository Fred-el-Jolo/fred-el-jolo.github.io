# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
# Serve locally with live reload
bundle exec jekyll serve

# Build to _site/
bundle exec jekyll build

# Serve including draft posts
bundle exec jekyll serve --drafts
```

SASS linting is configured via `.sasslintrc` (uses `sass-lint` npm package, no `package.json` is present — install globally if needed: `npm install -g sass-lint`).

## Architecture

This is a Jekyll static blog deployed to GitHub Pages at [aesthetecoding.io](https://aesthetecoding.io).

### Layout system

All pages flow through a two-level layout chain:

1. **`_layouts/post.html`** and root pages (`index.html`, `about.html`, etc.) call `main_layout.html` with a `content` parameter naming an `_includes` partial.
2. **`_includes/main_layout.html`** is the full HTML shell (header, nav, footer). It renders the named partial inside `<main>` via `{%- include {{include.content}} -%}`.

The `reveal` layout (`_layouts/reveal.html`) is a separate standalone shell for Reveal.js presentation posts — it does not use `main_layout.html`.

### Posts

Posts live in `_posts/` as Markdown (`.md`) or HTML (`.html`) files named `YYYY-MM-DD-slug.ext`. Front matter fields used across the site:

- `layout`: `post` (standard article) or `reveal` (slide deck)
- `title`, `date`, `categories`, `tags`
- `image`: thumbnail filename resolved from `assets/images/posts/thumbnails/`
- `description`, `author`, `image_small`, `image_type`, `image_width`, `image_height`, `image_alt` — used for OG/Twitter meta tags via `_includes/components/html-header-meta.html`

The `<!-- more -->` marker splits the excerpt shown in post summaries.

### Styling

CSS follows BEM methodology. Source is in `_sass/` and compiled via `assets/css/main.scss`:

- `_sass/vendors/` — third-party (normalize, include-media, Font Awesome 5)
- `_sass/bem/` — design tokens (`_variables.scss`, `_mixins.scss`, `_placeholders.scss`) and one file per BEM block under `common.blocks/`
- Breakpoints: `phone: 320px`, `tablet: 768px`, `desktop: 1024px`, `wide: 1300px` (via `include-media`)
- Syntax highlighting theme: `rouge_tranquilpeak` (swap by editing the import in `main.scss`)

`.sasslintrc` enforces tab indentation, alphabetical property order, no `!important`, no vendor prefixes (except non-standard), colors via variables only.

### Search

Client-side tag/category search — no external index. `search.html` uses CSS-only tab switching between tags and categories, both rendered by `_includes/search_items.html` from `site.tags` / `site.categories`.

### Pagination

Handled by `jekyll-paginate`. Posts per page and path are set in `_config.yml` (`paginate: 10`, `paginate_path: /page:num/index.html`). Pagination UI is in `_includes/components/pagination.html`.
