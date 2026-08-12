/**
 * aesthetecoding.io — static site build pipeline
 *
 * Source layout:
 *   _articles/{YYYY-MM-DD-slug}/meta.json   — article metadata
 *   _articles/{YYYY-MM-DD-slug}/content.html — article body (only the .col contents)
 *   _articles/{YYYY-MM-DD-slug}/assets/      — article images
 *   _templates/article.html                  — article page wrapper
 *   _templates/home.html                     — home page template
 *   _config/site.json                        — site-wide config
 *   _config/categories.json                  — category definitions
 *
 * Output:
 *   dist/index.html              — generated home page
 *   dist/sitemap.xml             — generated
 *   dist/articles/{slug}/index.html — generated article page
 *   dist/articles/{slug}/assets/ — copied article assets
 *   dist/{css,js,assets}/        — copied verbatim
 *
 * Safe build: writes to dist_tmp/, then atomically swaps with dist/ on success.
 * On failure dist/ is untouched.
 */

import { readdir, readFile, writeFile, mkdir, cp, rm, rename, stat } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";

const ROOT = new URL("..", import.meta.url).pathname;
const ARTICLES_SRC = join(ROOT, "_articles");
const TEMPLATES = join(ROOT, "_templates");
const CONFIG_DIR = join(ROOT, "_config");
const DIST = join(ROOT, "dist");
const DIST_TMP = join(ROOT, "_dist_tmp");
const DIST_OLD = join(ROOT, "_dist_old");

// ─── types ───────────────────────────────────────────────────────────────────

interface ArticleMeta {
  title: string;
  slug: string;
  date: string;
  category: string;           // key in categories.json
  tags: string[];
  description: string;
  readingTime: number;
  aiProvenance: "none" | "enriched" | "full";
  cover?: string;             // filename in the article's assets/ folder — required 16:9 hero, universal fallback
  coverAlt?: string;
  coverFocus?: string;        // e.g. "78% 40%"
  featuredCover?: string;     // optional 5:4 crop for the home "À la une" card — falls back to cover
  featuredCoverFocus?: string;
  listCover?: string;         // optional square crop for the home list-row thumbnail — falls back to cover
  listCoverFocus?: string;
  ecoCoverDescription?: string;
  featured?: boolean;
  status: "draft" | "published";
  format?: "article" | "deck"; // "deck" renders via _templates/deck.html from slides.html instead of content.html
  _folder: string;            // source folder name (internal)
}

interface Category {
  label: string;
  color: string;   // CSS var name e.g. "--blue"
  filterKey: string;
  icon: string;    // SVG path/shape content (no outer <svg>)
}

interface SiteConfig {
  title: string;
  titleRaw: string;
  tagline: string;
  url: string;
  author: string;
  authorUrl: string;
  github: string;
  linkedin: string;
  logoPath: string;
  footerPunch: string;
  copyright: string;
  locale: string;
}

// ─── loaders ─────────────────────────────────────────────────────────────────

async function loadJson<T>(path: string): Promise<T> {
  const text = await readFile(path, "utf-8");
  return JSON.parse(text) as T;
}

async function loadArticles(): Promise<ArticleMeta[]> {
  if (!existsSync(ARTICLES_SRC)) return [];
  const folders = await readdir(ARTICLES_SRC);
  const articles: ArticleMeta[] = [];

  for (const folder of folders) {
    const metaPath = join(ARTICLES_SRC, folder, "meta.json");
    if (!existsSync(metaPath)) continue;
    try {
      const meta = await loadJson<ArticleMeta>(metaPath);
      meta._folder = folder;
      if (meta.status === "published") articles.push(meta);
    } catch (e) {
      console.warn(`  ⚠ skipping ${folder}: ${(e as Error).message}`);
    }
  }

  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

// ─── HTML generators ─────────────────────────────────────────────────────────

const PROV_ICONS = {
  none: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19l1.2-4L16 5.2a1.8 1.8 0 0 1 2.6 2.6L8.8 17.6 5 19z"></path><path d="M14.5 6.8l2.7 2.7"></path></svg>`,
  enriched: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l1.6 4.6L18 10l-4.4 1.4L12 16l-1.6-4.6L6 10l4.4-1.4z"></path></svg>`,
  full: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.6l2.3 6.4L20.6 10l-6.3 2L12 18.4 9.7 12 3.4 10l6.3-2z"></path></svg>`,
};
const PROV_TITLES = { none: "Generated without AI", enriched: "Enriched with AI", full: "Generated with AI" };
const PROV_LABELS = { none: "without AI", enriched: "AI-enriched", full: "with AI" };

function provenanceBadge(prov: "none" | "enriched" | "full"): string {
  return `<span class="prov prov-${prov}" title="${PROV_TITLES[prov]}"><span class="pg">${PROV_ICONS[prov]}</span>${PROV_LABELS[prov]}</span>`;
}

const SLIDES_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="14" height="10" rx="1.5"></rect><rect x="7" y="10" width="14" height="10" rx="1.5"></rect></svg>`;

function formatBadge(meta: ArticleMeta): string {
  if (meta.format !== "deck") return "";
  return `<span class="fmt-slides" title="Slide-format article">${SLIDES_ICON}slides</span>`;
}

function categoryIcon(cat: Category): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${cat.icon}</svg>`;
}

function formatDate(iso: string): string {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function coverSection(meta: ArticleMeta): string {
  if (!meta.cover) return "";
  const focus = meta.coverFocus ?? "50% 50%";
  const ecoDesc = meta.ecoCoverDescription ?? meta.coverAlt ?? "";
  return `
  <div class="heroimg"><div class="ph" style="--focus:${focus}"><div class="cover"></div><img class="cover-img" src="assets/${meta.cover}" alt="${meta.coverAlt ?? ""}"></div></div>
  <div class="eco-cap"><div class="b2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c0-8 6-14 16-15 0 10-6 16-16 15Z"></path><path d="M4 20c3-7 7-10 12-12"></path></svg><span>image omitted in eco mode — "${ecoDesc}"</span></div></div>`;
}

function articleRow(meta: ArticleMeta, cat: Category): string {
  const src = meta.listCover ?? meta.cover;
  const focus = meta.listCoverFocus ?? meta.coverFocus ?? "50% 50%";
  const fallback = meta.listCover && meta.cover
    ? ` data-fallback="/articles/${meta.slug}/assets/${meta.cover}"`
    : "";
  const thumb = src
    ? `<img class="cover-img" src="/articles/${meta.slug}/assets/${src}" style="--focus:${focus}"${fallback} alt="">`
    : "";
  return `
    <a class="row" href="/articles/${meta.slug}/" style="--cat:var(${cat.color})" data-cat="${meta.category}">
      <div class="thumb">
        <div class="cover"></div>
        ${thumb}
        <div class="ico">${categoryIcon(cat)}</div>
      </div>
      <div class="mid">
        <h3>${meta.title}</h3>
        <div class="m"><span class="cat">${cat.label}</span><span>${meta.readingTime} min read</span>${provenanceBadge(meta.aiProvenance)}${formatBadge(meta)}</div>
      </div>
      <span class="date">${formatDate(meta.date)}</span>
    </a>`;
}

function featuredSection(meta: ArticleMeta, cat: Category): string {
  const src = meta.featuredCover ?? meta.cover;
  const focus = meta.featuredCoverFocus ?? meta.coverFocus ?? "50% 50%";
  const fallback = meta.featuredCover && meta.cover
    ? `/articles/${meta.slug}/assets/${meta.cover}`
    : "/assets/logo-dark-bg.png";
  const img = src
    ? `<img class="cover-img" src="/articles/${meta.slug}/assets/${src}" style="--focus:${focus}" data-fallback="${fallback}" alt="${meta.coverAlt ?? ""}">`
    : "";
  return `
  <section class="feat-wrap"><div class="feat">
    <div>
      <p class="eyebrow">À la une</p>
      <h2>${meta.title}</h2>
      <p>${meta.description}</p>
      <div class="meta">
        <span class="cat">${cat.label}</span><span>${formatDate(meta.date)}</span><span>·</span><span>${meta.readingTime} min read</span>
        ${provenanceBadge(meta.aiProvenance)}${formatBadge(meta)}
      </div>
      <a class="cta" href="/articles/${meta.slug}/">Read the build <span class="ar">→</span></a>
    </div>
    <div style="--cat:var(${cat.color})"><div class="ph">
      <div class="cover"></div>
      ${img}
      <div class="ico">${categoryIcon(cat)}<span class="gl">${cat.label}</span></div>
    </div></div>
  </div></section>`;
}

function topicsNav(categories: Record<string, Category>): string {
  const entries = Object.entries(categories);
  return entries.map(([, cat], i) => {
    const sep = i < entries.length - 1 ? `<span class="sep">·</span>` : "";
    return `<a href="#" data-tag="${cat.filterKey}">${cat.label.toLowerCase()}</a>${sep}`;
  }).join("\n      ");
}

// ─── SEO generators ──────────────────────────────────────────────────────────

function articleJsonLd(meta: ArticleMeta, site: SiteConfig): string {
  const url = `${site.url}/articles/${meta.slug}/`;
  const image = meta.cover ? `${site.url}/articles/${meta.slug}/assets/${meta.cover}` : undefined;
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    author: { "@type": "Person", name: site.author, url: site.authorUrl },
    publisher: {
      "@type": "Organization",
      name: site.titleRaw,
      logo: { "@type": "ImageObject", url: site.url + site.logoPath },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    keywords: meta.tags.join(", "),
    articleSection: meta.category,
  };
  if (image) ld.image = image;
  return JSON.stringify(ld, null, 2);
}

function homeJsonLd(site: SiteConfig): string {
  const ld = {
    "@context": "https://schema.org",
    "@type": ["WebSite", "Blog"],
    name: site.titleRaw,
    description: site.tagline,
    url: site.url,
    author: { "@type": "Person", name: site.author, url: site.authorUrl },
    inLanguage: site.locale,
  };
  return JSON.stringify(ld, null, 2);
}

function articleHeadSeo(meta: ArticleMeta, site: SiteConfig): string {
  const url = `${site.url}/articles/${meta.slug}/`;
  const image = meta.cover
    ? `${site.url}/articles/${meta.slug}/assets/${meta.cover}`
    : site.url + site.logoPath;
  return [
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:title" content="${meta.title}">`,
    `<meta property="og:description" content="${meta.description}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:site_name" content="${site.titleRaw}">`,
    `<meta property="article:published_time" content="${meta.date}">`,
    `<meta property="article:section" content="${meta.category}">`,
    ...meta.tags.map(t => `<meta property="article:tag" content="${t}">`),
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${meta.title}">`,
    `<meta name="twitter:description" content="${meta.description}">`,
    `<meta name="twitter:image" content="${image}">`,
    `<script type="application/ld+json">\n${articleJsonLd(meta, site)}\n</script>`,
  ].join("\n");
}

function homeHeadSeo(site: SiteConfig): string {
  return [
    `<link rel="canonical" href="${site.url}/">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${site.titleRaw}">`,
    `<meta property="og:description" content="${site.tagline}">`,
    `<meta property="og:url" content="${site.url}/">`,
    `<meta property="og:image" content="${site.url + site.logoPath}">`,
    `<meta property="og:site_name" content="${site.titleRaw}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${site.titleRaw}">`,
    `<meta name="twitter:description" content="${site.tagline}">`,
    `<meta name="twitter:image" content="${site.url + site.logoPath}">`,
    `<script type="application/ld+json">\n${homeJsonLd(site)}\n</script>`,
  ].join("\n");
}

function generateSitemap(articles: ArticleMeta[], site: SiteConfig): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    `  <url><loc>${site.url}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    ...articles.map(a =>
      `  <url><loc>${site.url}/articles/${a.slug}/</loc><lastmod>${a.date}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    ),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

// ─── template rendering ───────────────────────────────────────────────────────

function render(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce(
    (html, [key, val]) => html.replaceAll(`{{${key}}}`, val),
    template
  );
}

async function buildArticlePage(
  meta: ArticleMeta,
  cat: Category,
  site: SiteConfig,
  template: string,
  destDir: string
): Promise<void> {
  const contentPath = join(ARTICLES_SRC, meta._folder, "content.html");
  if (!existsSync(contentPath)) {
    console.warn(`  ⚠ missing content.html for ${meta.slug}, skipping`);
    return;
  }
  const body = await readFile(contentPath, "utf-8");
  const html = render(template, {
    PAGE_TITLE: `${meta.title} — {aesthetecoding.io}`,
    META_DESCRIPTION: meta.description,
    HEAD_SEO: articleHeadSeo(meta, site),
    KICK_COLOR: cat.color,
    KICK_LABEL: cat.label,
    ARTICLE_TITLE: meta.title,
    BYLINE_DATE: formatDate(meta.date),
    BYLINE_READTIME: `${meta.readingTime} min read`,
    PROVENANCE_BADGE: provenanceBadge(meta.aiProvenance),
    COVER_SECTION: coverSection(meta),
    ARTICLE_BODY: body,
  });

  const dir = join(destDir, "articles", meta.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), html);

  // copy article assets
  const srcAssets = join(ARTICLES_SRC, meta._folder, "assets");
  if (existsSync(srcAssets)) {
    await cp(srcAssets, join(dir, "assets"), { recursive: true });
  }
}

async function buildDeckPage(
  meta: ArticleMeta,
  site: SiteConfig,
  template: string,
  destDir: string
): Promise<void> {
  const slidesPath = join(ARTICLES_SRC, meta._folder, "slides.html");
  if (!existsSync(slidesPath)) {
    console.warn(`  ⚠ missing slides.html for ${meta.slug}, skipping`);
    return;
  }
  const slides = await readFile(slidesPath, "utf-8");
  const html = render(template, {
    PAGE_TITLE: `${meta.title} — {aesthetecoding.io}`,
    META_DESCRIPTION: meta.description,
    HEAD_SEO: articleHeadSeo(meta, site),
    DECK_SLIDES: slides,
  });

  const dir = join(destDir, "articles", meta.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), html);

  // copy article assets
  const srcAssets = join(ARTICLES_SRC, meta._folder, "assets");
  if (existsSync(srcAssets)) {
    await cp(srcAssets, join(dir, "assets"), { recursive: true });
  }
}

async function buildHome(
  articles: ArticleMeta[],
  categories: Record<string, Category>,
  site: SiteConfig,
  template: string,
  destDir: string
): Promise<void> {
  const featured = articles.find(a => a.featured) ?? articles[0];
  const featCat = featured ? (categories[featured.category] ?? Object.values(categories)[0]) : Object.values(categories)[0];

  const rows = articles
    .filter(a => !featured || a.slug !== featured.slug)
    .map(a => articleRow(a, categories[a.category] ?? { label: a.category, color: "--blue", filterKey: a.category, icon: "" }))
    .join("\n");

  const html = render(template, {
    HOME_SEO: homeHeadSeo(site),
    TOPICS_NAV: topicsNav(categories),
    FEATURED_SECTION: featured ? featuredSection(featured, featCat) : "",
    ARTICLE_COUNT: String(articles.length),
    ARTICLES_LIST: rows,
  });

  await writeFile(join(destDir, "index.html"), html);
}

// ─── file copy helpers ────────────────────────────────────────────────────────

async function copyStaticDirs(destDir: string): Promise<void> {
  const staticDirs = ["css", "js", "assets"];
  for (const dir of staticDirs) {
    const src = join(ROOT, dir);
    if (existsSync(src)) await cp(src, join(destDir, dir), { recursive: true });
  }
  // CNAME (custom domain) + robots.txt
  const cname = join(ROOT, "CNAME");
  if (existsSync(cname)) await cp(cname, join(destDir, "CNAME"));
  const robots = join(ROOT, "robots.txt");
  if (existsSync(robots)) await cp(robots, join(destDir, "robots.txt"));
}

// ─── atomic dist swap ─────────────────────────────────────────────────────────

async function atomicSwap(): Promise<void> {
  await rm(DIST_OLD, { recursive: true, force: true });
  if (existsSync(DIST)) await rename(DIST, DIST_OLD);
  await rename(DIST_TMP, DIST);
  await rm(DIST_OLD, { recursive: true, force: true });
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const start = Date.now();
  console.log("⬡  aesthetecoding build starting…\n");

  // load config
  const site = await loadJson<SiteConfig>(join(CONFIG_DIR, "site.json"));
  const categories = await loadJson<Record<string, Category>>(join(CONFIG_DIR, "categories.json"));
  const articleTemplate = await readFile(join(TEMPLATES, "article.html"), "utf-8");
  const deckTemplate = await readFile(join(TEMPLATES, "deck.html"), "utf-8");
  const homeTemplate = await readFile(join(TEMPLATES, "home.html"), "utf-8");

  // load articles
  const articles = await loadArticles();
  console.log(`  found ${articles.length} published article(s)`);

  // build to tmp
  await rm(DIST_TMP, { recursive: true, force: true });
  await mkdir(DIST_TMP, { recursive: true });

  // copy static
  await copyStaticDirs(DIST_TMP);
  console.log("  static dirs copied");

  // build articles
  for (const meta of articles) {
    if (meta.format === "deck") {
      await buildDeckPage(meta, site, deckTemplate, DIST_TMP);
    } else {
      const cat = categories[meta.category] ?? { label: meta.category, color: "--blue", filterKey: meta.category, icon: "" };
      await buildArticlePage(meta, cat, site, articleTemplate, DIST_TMP);
    }
    console.log(`  ✓ /articles/${meta.slug}/`);
  }

  // build home
  await buildHome(articles, categories, site, homeTemplate, DIST_TMP);
  console.log("  ✓ /index.html");

  // generate sitemap
  await writeFile(join(DIST_TMP, "sitemap.xml"), generateSitemap(articles, site));
  console.log("  ✓ /sitemap.xml");

  // atomic swap
  await atomicSwap();

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\n✅  built in ${elapsed}s → dist/`);
}

main().catch(e => {
  console.error("\n✗  build failed:", (e as Error).message);
  // clean up tmp; dist is untouched
  rm(DIST_TMP, { recursive: true, force: true }).catch(() => {});
  process.exit(1);
});
