"""SEO / AEO pass over every page. Run last (tools/build-all.sh does).

- canonical, Open Graph and Twitter tags per page (title, description, URL, share image)
- JSON-LD: Organization, SoftwareApplication (+ offers), FAQPage, BlogPosting,
  Article, AboutPage, ContactPage, BreadcrumbList
- sitemap.xml, robots.txt, llms.txt
Change BASE when the site moves to its own domain.
"""
import html as H
import json
import re
from datetime import date
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BASE = 'https://anowarhdesign.github.io/quantiify-website/'
TODAY = date.today().isoformat()
ORG = {'@type': 'Organization', '@id': BASE + '#org', 'name': 'Conneqted Agents', 'url': 'https://conneqtedagents.ai/',
       'logo': BASE + 'assets/conneqted-logo-dark.svg', 'email': 'support@conneqtedagents.ai', 'telephone': '+1-408-500-5613',
       'address': {'@type': 'PostalAddress', 'streetAddress': '6412 Spring Meadow Ct', 'addressLocality': 'San Jose',
                   'addressRegion': 'CA', 'addressCountry': 'US'}}

PAGES = sorted([p for p in ROOT.glob('*.html')] + list(ROOT.glob('projects/*.html')) + list(ROOT.glob('blog/*.html'))
               + list(ROOT.glob('case-studies/*.html')))


def rel(p):
    return p.relative_to(ROOT).as_posix()


def url(p):
    r = rel(p)
    return BASE if r == 'index.html' else BASE + r


def text(s):
    return re.sub(r'\s+', ' ', H.unescape(re.sub(r'<[^>]+>', ' ', s))).strip()


def og_image(p, src_rel):
    """Make a 1200x630 JPG share image (social sites handle JPG best) from a page image."""
    out = ROOT / 'assets/og' / (rel(p).replace('/', '-').replace('.html', '') + '.jpg')
    out.parent.mkdir(exist_ok=True)
    im = Image.open(ROOT / src_rel).convert('RGB')
    w, h = im.size
    tw, th = (w, round(w * 630 / 1200)) if w / h < 1200 / 630 else (round(h * 1200 / 630), h)
    im = im.crop(((w - tw) // 2, (h - th) // 2, (w - tw) // 2 + tw, (h - th) // 2 + th)).resize((1200, 630), Image.LANCZOS)
    im.save(out, 'JPEG', quality=84, optimize=True, progressive=True)
    return BASE + out.relative_to(ROOT).as_posix()


def crumbs(items):
    return {'@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i, 'name': n, 'item': u} for i, (n, u) in enumerate(items, 1)]}


def set_meta(s, attr, key, val):
    tag = f'<meta {attr}="{key}" content="{H.escape(val, quote=True)}">'
    pat = rf'<meta {attr}="{re.escape(key)}" content="[^"]*">'
    return re.sub(pat, tag, s) if re.search(pat, s) else s.replace('</head>', tag + '\n</head>', 1)


home = (ROOT / 'index.html').read_text(encoding='utf-8')
FAQ = [(text(q), text(a)) for q, a in re.findall(r'<summary>.*?<span class="q">(.*?)</span>.*?</summary><p>(.*?)</p>', home, flags=re.S)]
PLANS = re.findall(r'<article class="plan[^"]*">\s*<h3>(.*?)</h3>\s*<p class="plan-desc">(.*?)</p>.*?data-m="(\d+)"', home, flags=re.S)
sitemap, llms = [], []

for p in PAGES:
    s = p.read_text(encoding='utf-8')
    r = rel(p)
    title = text(re.search(r'<title>(.*?)</title>', s, flags=re.S).group(1))
    desc = re.search(r'<meta name="description" content="([^"]*)">', s).group(1)
    u = url(p)

    # share image
    img_rel = 'assets/og-image.jpg'
    m = re.search(r'<figure class="p-photo[^"]*"[^>]*>\s*<div class="p-photo-frame"><img src="(?:\.\./)?([^"]+)"', s) \
        or re.search(r'<figure class="p-photo post-cover"><div class="p-photo-frame"><img src="(?:\.\./)?([^"]+)"', s)
    image = og_image(p, m.group(1)) if (m and r != 'index.html') else BASE + img_rel

    s = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{u}">', s)
    for k, v in [('og:url', u), ('og:title', title), ('og:description', desc), ('og:image', image),
                 ('og:image:alt', title), ('og:type', 'article' if r.startswith(('blog/', 'case-studies/')) else 'website')]:
        s = set_meta(s, 'property', k, v)
    for k, v in [('twitter:title', title), ('twitter:description', desc), ('twitter:image', image), ('twitter:card', 'summary_large_image')]:
        s = set_meta(s, 'name', k, v)
    if 'og:image:width' in s and image != BASE + img_rel:
        s = set_meta(s, 'property', 'og:image:width', '1200'); s = set_meta(s, 'property', 'og:image:height', '630')
    s = set_meta(s, 'name', 'theme-color', '#0b1220')
    s = set_meta(s, 'name', 'robots', 'index, follow, max-image-preview:large')

    # structured data
    h1 = text(re.search(r'<h1[^>]*>(.*?)</h1>', s, flags=re.S).group(1))
    graph = [ORG]
    home_crumb = ('Home', BASE)
    if r == 'index.html':
        graph += [{'@type': 'WebSite', '@id': BASE + '#site', 'url': BASE, 'name': 'Quantiify', 'publisher': {'@id': BASE + '#org'}},
                  {'@type': 'SoftwareApplication', 'name': 'Quantiify', 'url': BASE, 'applicationCategory': 'BusinessApplication',
                   'applicationSubCategory': 'Construction takeoff and estimation software', 'operatingSystem': 'Web',
                   'description': desc, 'image': BASE + img_rel, 'publisher': {'@id': BASE + '#org'},
                   'offers': [{'@type': 'Offer', 'name': text(n), 'description': text(d), 'price': pr, 'priceCurrency': 'USD',
                               'url': BASE + '#pricing'} for n, d, pr in PLANS]},
                  {'@type': 'FAQPage', 'mainEntity': [{'@type': 'Question', 'name': q,
                                                       'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in FAQ]}]
    else:
        trail = [home_crumb]
        if r.startswith('projects/'):
            trail += [('Projects', BASE + '#trades')]
            graph.append({'@type': 'Service', 'name': h1, 'description': desc, 'provider': {'@id': BASE + '#org'},
                          'serviceType': 'Construction quantity takeoff and estimation', 'url': u})
        elif r.startswith('blog/'):
            trail += [('Blog', BASE + 'blog.html')]
            graph.append({'@type': 'BlogPosting', 'headline': h1[:110], 'description': desc, 'image': image, 'url': u,
                          'mainEntityOfPage': u, 'author': {'@id': BASE + '#org'}, 'publisher': {'@id': BASE + '#org'},
                          'dateModified': TODAY})
        elif r.startswith('case-studies/'):
            trail += [('Case studies', BASE + 'case-studies.html')]
            graph.append({'@type': 'Article', 'headline': h1[:110], 'description': desc, 'image': image, 'url': u,
                          'author': {'@id': BASE + '#org'}, 'publisher': {'@id': BASE + '#org'}, 'dateModified': TODAY})
        else:
            kind = {'about.html': 'AboutPage', 'book.html': 'ContactPage'}.get(r, 'WebPage')
            graph.append({'@type': kind, 'name': title, 'description': desc, 'url': u})
        trail.append((h1[:80], u))
        graph.append(crumbs(trail))
    ld = '<script type="application/ld+json" id="ld">' + json.dumps({'@context': 'https://schema.org', '@graph': graph},
                                                                   ensure_ascii=False) + '</script>'
    s = re.sub(r'\n?<script type="application/ld\+json" id="ld">.*?</script>', '', s, flags=re.S)
    s = s.replace('</head>', ld + '\n</head>', 1)
    p.write_text(s, encoding='utf-8')

    pri = '1.0' if r == 'index.html' else '0.8' if r.startswith(('projects/', 'book', 'about')) else '0.3' if r in ('privacy.html', 'terms.html') else '0.6'
    sitemap.append(f'  <url><loc>{u}</loc><lastmod>{TODAY}</lastmod><priority>{pri}</priority></url>')
    llms.append(f'- [{title}]({u}): {desc}')

(ROOT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                                  + '\n'.join(sitemap) + '\n</urlset>\n', encoding='utf-8')
(ROOT / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {BASE}sitemap.xml\n', encoding='utf-8')
faq_md = '\n'.join(f'**{q}**\n{a}\n' for q, a in FAQ)
plans_md = '\n'.join(f'- {text(n)}: ${pr}/month. {text(d)}' for n, d, pr in PLANS)
(ROOT / 'llms.txt').write_text(f'''# Quantiify

> Quantiify is AI-assisted construction takeoff and estimation software by Conneqted Agents. It reads PDF and CAD drawings, detects and counts symbols, measures lengths and areas, and turns reviewed quantities into priced estimates and BOQs. Estimators stay in control: every AI result is reviewed, edited and approved before it is used.

Trades: Electrification; Sanitary & plumbing; Electromechanical; Structural & finishing.
Workflow: Project setup, Upload, AI legend detection, Symbol count, Cable takeoff, Estimate, Export (Excel, CSV, PDF).

## Plans
{plans_md}

## Pages
{chr(10).join(llms)}

## FAQ
{faq_md}
## Contact
- Book a demo: {BASE}book.html
- Email: info@quantiify.ai
''', encoding='utf-8')
print(f'SEO pass: {len(PAGES)} pages, {len(FAQ)} FAQs, {len(PLANS)} plans')
