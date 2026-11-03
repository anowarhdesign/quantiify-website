// Every page of the site: URL path (relative to the base), the page to render and its SEO data.
// The prerender script writes one HTML file per entry; the client router uses the same table.
import { HOME_META } from './content/home.js';
import { ABOUT_META } from './content/about.js';
import { BLOG_META, POSTS } from './content/blog.js';
import { CASES, CASES_META } from './content/caseStudies.js';
import { PROJECTS, projectH1 } from './content/projects.js';
import { LEGAL } from './content/legal.js';

const legal = l => ({
  path: `/${l.slug}.html`, page: 'legal', props: { slug: l.slug },
  meta: { title: `${l.title} · Quantiify`, description: l.description, h1: l.h1.replace(/<[^>]+>/g, ''), kind: 'WebPage', priority: '0.3' },
});

export const ROUTES = [
  { path: '/', page: 'home', meta: { ...HOME_META, kind: 'home', priority: '1.0' } },
  { path: '/about.html', page: 'about', meta: { ...ABOUT_META, kind: 'AboutPage', priority: '0.8' } },
  { path: '/book.html', page: 'book', meta: {
    title: 'Book a Demo · Quantiify', description: 'Book a Quantiify demo from the calendar or request a call. Discuss your construction takeoff, project volume, and trade requirements with the Quantiify team.',
    h1: 'Let’s talk about your estimating workflow.', kind: 'ContactPage', priority: '0.8' } },
  { path: '/blog.html', page: 'blog', meta: { ...BLOG_META, h1: 'Construction estimating & AI takeoff blog', kind: 'WebPage', priority: '0.6' } },
  ...POSTS.map(p => ({
    path: `/blog/${p.slug}.html`, page: 'post', props: { slug: p.slug },
    meta: { title: `${p.title} · Quantiify Blog`, description: p.excerpt, h1: p.title, kind: 'BlogPosting', section: 'blog', ogImage: true, priority: '0.6' },
  })),
  { path: '/case-studies.html', page: 'cases', meta: { ...CASES_META, h1: 'Case studies', kind: 'WebPage', priority: '0.6' } },
  ...CASES.filter(c => c.slug).map(c => ({
    path: `/case-studies/${c.slug}.html`, page: 'case', props: { slug: c.slug },
    meta: { title: `${c.title} · Quantiify Case Study`, description: c.deck, h1: c.title, kind: 'Article', section: 'case-studies', ogImage: true, priority: '0.6' },
  })),
  ...PROJECTS.map(p => ({
    path: `/projects/${p.slug}.html`, page: 'project', props: { slug: p.slug },
    meta: { title: p.title, description: p.lede, h1: projectH1(p), kind: 'Service', section: 'projects', ogImage: true, bodyClass: 'subpage', priority: '0.8' },
  })),
  legal(LEGAL.privacy),
  legal(LEGAL.terms),
];

/** Output file for a route, e.g. "/" -> "index.html", "/blog/x.html" -> "blog/x.html". */
export const routeFile = r => (r.path === '/' ? 'index.html' : r.path.slice(1));

export const findRoute = pathname => ROUTES.find(r => r.path === pathname || (r.path === '/' && pathname === '/index.html'));
