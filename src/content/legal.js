// Privacy Policy and Terms of Service: markdown in ./legal, one `## Heading` per numbered section.
// Draft text: have it reviewed by a Bangladesh-qualified lawyer before relying on it.
import { parseFrontMatter, renderMarkdown } from './markdown.js';

const files = import.meta.glob('./legal/*.md', { query: '?raw', import: 'default', eager: true });

export const LEGAL = Object.fromEntries(Object.entries(files).map(([path, raw]) => {
  const { data, body } = parseFrontMatter(raw);
  const sections = body.split(/^## /m).slice(1).map(chunk => {
    const nl = chunk.indexOf('\n');
    return { title: chunk.slice(0, nl).trim(), html: renderMarkdown(chunk.slice(nl + 1)).trim() };
  });
  const slug = path.match(/([^/]+)\.md$/)[1];
  return [slug, { ...data, slug, sections }];
}));
