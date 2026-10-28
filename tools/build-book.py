"""Sync book.html's header, footer and asset versions from index.html.

Run from the site root:  python tools/build-book.py
book.html keeps its own booking section; only the shared shell is copied.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
home = (ROOT / 'index.html').read_text(encoding='utf-8')
book = (ROOT / 'book.html').read_text(encoding='utf-8')


def to_book(html):
    html = re.sub(r'href="#([\w-]+)"', r'href="index.html#\1"', html)
    html = html.replace('href="index.html#top"', 'href="index.html"')
    return html.replace('href="book.html"', 'href="#book"')


header = home[home.index('<header class="nav">'):home.index('</header>')]
book = book[:book.index('<header class="nav">')] + to_book(header) + book[book.index('</header>'):]
book = book[:book.index('<footer')] + to_book(home[home.index('<footer'):])
version = re.search(r'\?v=(\d+)', home).group(1)
book = re.sub(r'\?v=\d+', '?v=' + version, book)
(ROOT / 'book.html').write_text(book, encoding='utf-8')
print('synced book.html')
