// Blog posts: one markdown file per post in ./blog (front matter + body). The file name is the URL slug.
import { parseFrontMatter, renderMarkdown } from './markdown.js';

const files = import.meta.glob('./blog/*.md', { query: '?raw', import: 'default', eager: true });

export const POSTS = Object.entries(files)
  .map(([path, raw]) => {
    const { data, body } = parseFrontMatter(raw);
    return { ...data, slug: path.match(/([^/]+)\.md$/)[1], html: renderMarkdown(body) };
  })
  .sort((a, b) => a.order - b.order);

export const BLOG_META = {
  title: 'Construction Estimating & AI Takeoff Blog · Quantiify',
  description: 'Practical guides on construction takeoff, quantity estimation, AI-assisted workflows, drawing review, and trade-specific estimating.',
};

/** Up to three other posts: same trade first, then the rest in order. */
export function relatedPosts(post) {
  const others = POSTS.filter(q => q !== post);
  const rel = others.filter(q => q.trade === post.trade).slice(0, 2);
  return rel.concat(others.filter(q => !rel.includes(q)).slice(0, 3 - rel.length));
}
