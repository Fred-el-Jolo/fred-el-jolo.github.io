#!/usr/bin/env bash
# new-post.sh — interactive post creation for aesthetecoding.io
set -euo pipefail
command -v python3 >/dev/null 2>&1 || { echo "python3 is required"; exit 1; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE="$ROOT/scripts/post-template.html"
INDEX="$ROOT/index.html"
POSTS="$ROOT/posts"
TODAY="$(date +%Y-%m-%d)"

echo ""
echo "  aesthetecoding.io — New post"
echo "  ─────────────────────────────────────"
echo ""

read -rp "  Title: " TITLE
[[ -z "$TITLE" ]] && echo "  Title is required." && exit 1

AUTO_SLUG="$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g;s/-\+/-/g;s/^-\|-$//g')"
read -rp "  Slug [$AUTO_SLUG]: " SLUG
SLUG="${SLUG:-$AUTO_SLUG}"

EXISTING="$(grep -oh 'data-tag="[^"]*"' "$INDEX" 2>/dev/null | sed 's/data-tag="//;s/"//' | sort -u | tr '\n' ' ' || true)"
echo "  Existing tags: ${EXISTING:-none yet}"
read -rp "  Tags (comma-separated): " TAGS_RAW

read -rp "  Abstract (one line): " ABSTRACT
read -rp "  Reading time (min) [5]: " READING_TIME
READING_TIME="${READING_TIME:-5}"
read -rp "  Cover image filename (blank to skip): " COVER_FILE
read -rp "  Date [$TODAY]: " DATE_RAW
DATE_RAW="${DATE_RAW:-$TODAY}"
DATE_DISPLAY="$(date -d "$DATE_RAW" '+%-d %b %Y' 2>/dev/null || echo "$DATE_RAW")"

FOLDER="${DATE_RAW}-${SLUG}"
DEST="$POSTS/$FOLDER"

echo ""
echo "  ─────────────────────────────────────"
echo "  Title:    $TITLE"
echo "  Folder:   posts/$FOLDER"
echo "  Tags:     $TAGS_RAW"
echo "  Abstract: $ABSTRACT"
echo "  Date:     $DATE_DISPLAY  |  Reading: ${READING_TIME} min"
[[ -n "$COVER_FILE" ]] && echo "  Cover:    posts/$FOLDER/$COVER_FILE  ← place your image here"
echo "  ─────────────────────────────────────"
read -rp "  Create? [Y/n]: " CONFIRM
CONFIRM="${CONFIRM:-Y}"
[[ "$CONFIRM" != "Y" && "$CONFIRM" != "y" ]] && echo "  Aborted." && exit 0

# Build tag data
TAGS_LI=""
TAGS_DATA=""
TAGS_OVERLAY=""
IFS=',' read -ra TAG_ARR <<< "$TAGS_RAW"
for TAG in "${TAG_ARR[@]}"; do
  TAG="$(echo "$TAG" | sed 's/^ *//;s/ *$//')"
  SLUG_TAG="$(echo "$TAG" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')"
  TAGS_LI="${TAGS_LI}<li>${TAG}</li>"
  TAGS_DATA="${TAGS_DATA}${SLUG_TAG} "
  TAGS_OVERLAY="${TAGS_OVERLAY}<li><a href=\"#\" data-tag=\"${SLUG_TAG}\">${TAG}</a></li>"
done
TAGS_DATA="$(echo "$TAGS_DATA" | sed 's/ $//')"

# Cover HTML
if [[ -n "$COVER_FILE" ]]; then
  COVER_HTML="<div class=\"post-cover\"><img src=\"${COVER_FILE}\" alt=\"${TITLE}\" width=\"1200\" height=\"240\"></div>"
  CARD_IMG="<div class=\"article-illustration\"><img src=\"/posts/${FOLDER}/${COVER_FILE}\" width=\"300\" height=\"200\" alt=\"${TITLE}\"></div>"
else
  COVER_HTML=""
  CARD_IMG=""
fi

# Create post from template using Python3 for safe multi-line substitution
mkdir -p "$DEST"
python3 - <<PYEOF
import re
with open('$TEMPLATE') as f:
    html = f.read()
html = html.replace('{{TITLE}}', '$TITLE')
html = html.replace('{{ABSTRACT}}', '$ABSTRACT')
html = html.replace('{{DATE}}', '$DATE_DISPLAY')
html = html.replace('{{READING_TIME}}', '$READING_TIME')
html = html.replace('{{TAGS}}', '$TAGS_LI')
html = html.replace('{{COVER_HTML}}', '$COVER_HTML')
html = html.replace('{{CONTENT}}', '<p>$ABSTRACT</p>\n      <!-- Write your post content here -->')
with open('$DEST/index.html', 'w') as f:
    f.write(html)
PYEOF

# Build article card (single block, no newlines in variables)
CARD="  <article data-tags=\"${TAGS_DATA}\">\n    <ul class=\"tags\">${TAGS_OVERLAY}</ul>\n    <a href=\"/posts/${FOLDER}/\">\n      ${CARD_IMG}\n      <div>\n        <h2>${TITLE}</h2>\n        <div class=\"subtitle-bar\">\n          <span class=\"article-date\"><img src=\"/images/icons/calendar-alt-svgrepo-com.svg\" alt=\"\">&#160;${DATE_DISPLAY}</span>\n          <span class=\"reading-duration\"><img src=\"/images/icons/hourglass-svgrepo-com.svg\" alt=\"\">&#160;${READING_TIME} min</span>\n        </div>\n        <p>${ABSTRACT}</p>\n      </div>\n    </a>\n  </article>"

# Patch index.html — insert card after <!-- POSTS_START -->
perl -i -0pe "s|<!-- POSTS_START -->|<!-- POSTS_START -->\n\n${CARD}|" "$INDEX"

echo ""
echo "  ✓ Created  posts/$FOLDER/index.html"
echo "  ✓ Patched  index.html"
[[ -n "$COVER_FILE" ]] && echo "  → Place cover: cp your-image.$( echo "$COVER_FILE" | sed 's/.*\.//') $DEST/$COVER_FILE"
echo ""

[[ -n "${EDITOR:-}" ]] && "$EDITOR" "$DEST/index.html" || echo "  Tip: set \$EDITOR to auto-open the new post."
