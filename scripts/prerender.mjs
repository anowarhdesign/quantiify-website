// Static site generation, run after both Vite builds (npm run build):
// renders every route to its own HTML file with per-page <head>, writes 404.html for GitHub Pages,
// and generates sitemap.xml, robots.txt and llms.txt.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');
const { render, ROUTES, routeFile, headHtml, pageUrl, FAQ, PLANS } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const today = new Date().toISOString().slice(0, 10);
const SITE = pageUrl(ROUTES[0]);

function page(appHtml, head, bodyClass) {
  return template
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', appHtml)
    .replace('<body>', bodyClass ? `<body class="${bodyClass}">` : '<body>');
}

function write(file, html) {
  const out = path.join(dist, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}

for (const r of ROUTES) {
  write(routeFile(r), page(render(r.path), headHtml(r, today), r.meta.bodyClass));
  console.log('  prerendered', routeFile(r));
}

// GitHub Pages serves 404.html for unknown URLs; the client router renders the same Not found page.
write('404.html', page(render('/404'), '<title>Page not found · Quantiify</title>\n<meta name="robots" content="noindex">', '')
  .replace(/<meta name="robots" content="index[^"]*">\r?\n?/, ''));

// sitemap / llms.txt list pages in path order (blog/* before blog.html, as the old SEO script did)
const byPath = [...ROUTES].sort((a, b) => {
  const pa = routeFile(a).split('/'), pb = routeFile(b).split('/');
  for (let i = 0; i < Math.min(pa.length, pb.length); i++) if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
  return pa.length - pb.length;
});
fs.writeFileSync(path.join(dist, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + byPath.map(r => `  <url><loc>${pageUrl(r)}</loc><lastmod>${today}</lastmod><priority>${r.meta.priority}</priority></url>`).join('\n') + '\n</urlset>\n');
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}sitemap.xml\n`);
fs.writeFileSync(path.join(dist, 'llms.txt'), `# Quantiify

> Quantiify is AI-assisted construction takeoff and estimation software by Conneqted Agents. It reads PDF and CAD drawings, detects and counts symbols, measures lengths and areas, and turns reviewed quantities into priced estimates and BOQs. Estimators stay in control: every AI result is reviewed, edited and approved before it is used.

Trades: Electrification; Sanitary & plumbing; Electromechanical; Structural & finishing.
Workflow: Project setup, Upload, AI legend detection, Symbol count, Cable takeoff, Estimate, Export (Excel, CSV, PDF).

## Plans
${PLANS.map(p => `- ${p.name}: $${p.monthly}/month. ${p.desc}`).join('\n')}

## Pages
${byPath.map(r => `- [${r.meta.title}](${pageUrl(r)}): ${r.meta.description}`).join('\n')}

## FAQ
${FAQ.map(f => `**${f.q}**\n${f.a}\n`).join('\n')}
## Contact
- Book a demo: ${SITE}book.html
- Email: info@quantiify.ai
`);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${ROUTES.length} pages + 404.html, sitemap.xml, robots.txt, llms.txt`);
