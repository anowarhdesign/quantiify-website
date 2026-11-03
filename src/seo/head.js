// Per-page <head>: title, description, canonical, Open Graph, Twitter and JSON-LD.
// Used by the prerender script (static HTML) and by the client on route changes.
import { SITE_URL, OG_SITE_NAME, DEFAULT_OG_IMAGE, ORG } from '../content/site.js';
import { FAQ, PLANS } from '../content/home.js';
import { routeFile } from '../routes.js';

export const pageUrl = route => (route.path === '/' ? SITE_URL : SITE_URL + routeFile(route));

const ogImage = route => SITE_URL + (route.meta.ogImage
  ? `assets/og/${routeFile(route).replace(/\//g, '-').replace(/\.html$/, '')}.jpg`
  : DEFAULT_OG_IMAGE);

const crumbs = items => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) });

export function jsonLd(route, today = new Date().toISOString().slice(0, 10)) {
  const { meta } = route, u = pageUrl(route), image = ogImage(route);
  const graph = [ORG];
  if (meta.kind === 'home') {
    graph.push(
      { '@type': 'WebSite', '@id': SITE_URL + '#site', url: SITE_URL, name: 'Quantiify', publisher: { '@id': SITE_URL + '#org' } },
      { '@type': 'SoftwareApplication', name: 'Quantiify', url: SITE_URL, applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Construction takeoff and estimation software', operatingSystem: 'Web', description: meta.description,
        image: SITE_URL + DEFAULT_OG_IMAGE, publisher: { '@id': SITE_URL + '#org' },
        offers: PLANS.map(p => ({ '@type': 'Offer', name: p.name, description: p.desc, price: String(p.monthly), priceCurrency: 'USD', url: SITE_URL + '#pricing' })) },
      { '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    );
    return { '@context': 'https://schema.org', '@graph': graph };
  }
  const trail = [['Home', SITE_URL]];
  const h1 = meta.h1;
  if (meta.section === 'projects') {
    trail.push(['Projects', SITE_URL + '#trades']);
    graph.push({ '@type': 'Service', name: h1, description: meta.description, provider: { '@id': SITE_URL + '#org' },
      serviceType: 'Construction quantity takeoff and estimation', url: u });
  } else if (meta.section === 'blog') {
    trail.push(['Blog', SITE_URL + 'blog.html']);
    graph.push({ '@type': 'BlogPosting', headline: h1.slice(0, 110), description: meta.description, image, url: u, mainEntityOfPage: u,
      author: { '@id': SITE_URL + '#org' }, publisher: { '@id': SITE_URL + '#org' }, dateModified: today });
  } else if (meta.section === 'case-studies') {
    trail.push(['Case studies', SITE_URL + 'case-studies.html']);
    graph.push({ '@type': 'Article', headline: h1.slice(0, 110), description: meta.description, image, url: u,
      author: { '@id': SITE_URL + '#org' }, publisher: { '@id': SITE_URL + '#org' }, dateModified: today });
  } else {
    graph.push({ '@type': meta.kind, name: meta.title, description: meta.description, url: u });
  }
  trail.push([h1.slice(0, 80), u]);
  graph.push(crumbs(trail));
  return { '@context': 'https://schema.org', '@graph': graph };
}

/** [tag, attrs] pairs for everything in <head> that changes per page. */
export function headTags(route) {
  const { meta } = route, u = pageUrl(route), image = ogImage(route);
  const article = meta.section === 'blog' || meta.section === 'case-studies';
  return [
    ['meta', { name: 'description', content: meta.description }],
    ['link', { rel: 'canonical', href: u }],
    ['meta', { property: 'og:type', content: article ? 'article' : 'website' }],
    ['meta', { property: 'og:site_name', content: OG_SITE_NAME }],
    ['meta', { property: 'og:url', content: u }],
    ['meta', { property: 'og:title', content: meta.title }],
    ['meta', { property: 'og:description', content: meta.description }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:image:alt', content: meta.title }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: meta.title }],
    ['meta', { name: 'twitter:description', content: meta.description }],
    ['meta', { name: 'twitter:image', content: image }],
  ];
}

const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Static HTML for the prerendered page head. */
export function headHtml(route, today) {
  const tags = headTags(route).map(([t, a]) => `<${t} ${Object.entries(a).map(([k, v]) => `${k}="${attr(v)}"`).join(' ')}>`);
  const ld = JSON.stringify(jsonLd(route, today)).replace(/</g, '\\u003c');
  return [`<title>${attr(route.meta.title)}</title>`, ...tags, `<script type="application/ld+json" id="ld">${ld}</script>`].join('\n');
}

/** Bring the live document's head in line with a route after client-side navigation. */
export function applyHead(route) {
  document.title = route.meta.title;
  for (const [t, a] of headTags(route)) {
    const key = a.name ? `[name="${a.name}"]` : a.property ? `[property="${a.property}"]` : `[rel="${a.rel}"]`;
    let el = document.head.querySelector(t + key);
    if (!el) { el = document.createElement(t); document.head.appendChild(el); }
    for (const [k, v] of Object.entries(a)) el.setAttribute(k, v);
  }
  let ld = document.getElementById('ld');
  if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = 'ld'; document.head.appendChild(ld); }
  ld.textContent = JSON.stringify(jsonLd(route));
  document.body.classList.toggle('subpage', route.meta.bodyClass === 'subpage');
}
