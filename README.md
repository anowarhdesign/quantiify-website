# Quantiify website

Marketing site for **Quantiify** (AI takeoff and estimation for construction) by Conneqted Agents.
Live at <https://anowarhdesign.github.io/quantiify-website/>.

CAD look: drafting rulers, dimension lines, an animated WebGL floor-plan background, an AutoCAD-style crosshair
and status bar, and a title-block footer. Palette follows optiify.ai (navy `#0B1220`, blue `#2664F5` / `#1A6BD6`,
sky `#8FC2FA`, paper `#F4F8FD`, Manrope + JetBrains Mono) with Quantiify blue `#0072CE`.

Built with **Vite + React 19 + React Router 7**. Every route is prerendered to its own static HTML file at build
time (with its own title, meta, canonical, Open Graph/Twitter tags and JSON-LD), then hydrated in the browser.
URLs are the same as the earlier static site (`about.html`, `blog/<slug>.html`, …), so links and search results keep working.

## Requirements

Node.js 20.19+ (22 recommended) and npm.

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:5173/quantiify-website/
npm run build      # production build into dist/ (client + SSR bundle + prerender)
npm run preview    # serve dist/ at http://localhost:4173/quantiify-website/
```

`npm run build` runs three steps:

1. `vite build`: client bundle (hashed JS/CSS in `dist/static/`, `public/` copied as-is).
2. `vite build --ssr src/entry-server.jsx`: a server bundle used only at build time.
3. `node scripts/prerender.mjs`: renders every route in `src/routes.js` to `dist/<path>.html`, writes `404.html`,
   `sitemap.xml`, `robots.txt` and `llms.txt`.

## Deploy (GitHub Pages)

`.github/workflows/pages.yml` builds the site and deploys `dist/` on every push to `main` (or run it by hand from
the Actions tab). In the repository settings, **Pages → Build and deployment → Source** must be **GitHub Actions**.

The site is served from the `/quantiify-website/` sub-path, set as Vite's `base` in `vite.config.js`. Deep links
work because each page is a real HTML file; unknown URLs get `404.html`, which renders the site's Not found page.

Moving to a custom domain: build with `BASE_PATH=/` and `VITE_SITE_URL=https://your.domain/` (set both as `env`
on the build step), and add a `public/CNAME` file.

## Project structure

```
index.html                  HTML shell (fonts, theme colour); per-page <head> is injected at build time
public/assets/              images, logos, OG share images (served as /assets/…)
scripts/prerender.mjs       static generation + sitemap.xml, robots.txt, llms.txt
src/
  main.jsx                  browser entry (hydrates the prerendered page)
  entry-server.jsx          build-time render entry
  App.jsx                   routes → pages, inside the shared Layout
  routes.js                 every page: path, component, SEO data
  seo/head.js               title/meta/canonical/OG/Twitter/JSON-LD (build + client navigation)
  styles/global.css         the site stylesheet (unchanged from the static site)
  components/
    layout/                 Layout, Header (+ NavDropdown, phone menu), Footer, StatusBar
    cad/                    ShaderCanvas (WebGL2 background, CSS fallback), Ruler, DimLine, CadCursor
    home/                   Hero, ProductTour, screens (annotated product UI), Workflow, Trades, Comparison,
                            Audience, Stories, Pricing, Faq
    booking/                BookingSection, CalEmbed (Cal.com), LeadForm (FormSubmit)
    BeforeAfter, Counter, CtaBand, FilterGrid, PostCard, ListHero, AsideToc, ui (Eyebrow, Crumbs, …)
  pages/                    Home, About, Book, Blog, BlogPost, CaseStudies, CaseStudy, Project, Legal, NotFound
  content/                  all copy and data (see below)
  lib/                      motion helpers, useRevealOnce
```

## Editing content

All text lives in `src/content/`; no build-time scripts other than npm are needed.

| What | Where |
| --- | --- |
| Homepage sections, pricing, FAQ (FAQ and plans also feed JSON-LD and `llms.txt`) | `content/home.js` |
| Trades (nav cards, homepage tabs, sample schedules) | `content/trades.js` |
| Project pages (`projects/<slug>.html`) | `content/projects.js` |
| About page | `content/about.js` |
| Blog posts | `content/blog/<slug>.md`: front matter (`title`, `deck`, `trade`, `cover`, `minutes`, `excerpt`, `order`) + Markdown. A paragraph that is only `` `inline code` `` renders as a worked calculation. |
| Case studies | `content/caseStudies.js` + `content/case-studies/<slug>.json` |
| Privacy Policy / Terms | `content/legal/<name>.md`: one `## Heading` per numbered section |
| Contact details, form endpoint, site URL | `content/site.js` |

A new blog post is a new `.md` file: its route, sitemap entry, share image path and listing card follow automatically.
Share images are `public/assets/og/<section>-<slug>.jpg` (1200×630) for blog posts, case studies and project pages.

## Behaviour notes

- **Booking form** (`components/booking/LeadForm.jsx`) posts JSON to FormSubmit
  (`https://formsubmit.co/ajax/info@quantiify.ai`) with `_subject`, `_template: 'table'`, `_replyto` and a `_honey`
  honeypot field. `book.html#request` opens the form tab; `book.html?booth` shows the QR code for booth screens.
- **Reduced motion**: the CSS disables animations; the JS (tour/viewer auto-play, slider sweeps, counters, mouse
  trail) checks `prefers-reduced-motion` and stays still.
- The CAD crosshair, OSNAP snap box and mouse trail only run on fine pointers that can hover.
