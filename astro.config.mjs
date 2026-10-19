import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const root = dirname(fileURLToPath(import.meta.url));
const site = 'https://vegaload.ai';

function tagSlug(tag) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function field(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
  if (!match) return '';
  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

function asDay(value) {
  if (!value) return undefined;
  const day = String(value).slice(0, 10);
  const time = new Date(`${day}T00:00:00.000Z`).getTime();
  if (Number.isNaN(time)) return undefined;
  return day;
}

function latest(days) {
  const valid = days.filter(Boolean).sort();
  return valid.at(-1);
}

// Drafts are omitted, matching the production build.
function publishedPosts() {
  const dir = join(root, 'src/content/blog');
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md') && !name.startsWith('_'))
    .map((name) => {
      const raw = readFileSync(join(dir, name), 'utf8');
      const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      const tags = (field(frontmatter, 'tags').match(/[A-Za-z0-9-]+/g) ?? []).filter(
        (tag) => tag !== 'tags',
      );
      return {
        id: name.slice(0, -3),
        draft: field(frontmatter, 'draft') === 'true',
        day: asDay(field(frontmatter, 'updated') || field(frontmatter, 'date')),
        tags,
      };
    })
    .filter((post) => !post.draft);
}

function lastmodFor(url) {
  const posts = publishedPosts();
  const key = url.replace(/\/$/, '');
  if (key === site) {
    return asDay(statSync(join(root, 'public/index.html')).mtime.toISOString());
  }
  if (key === `${site}/blog`) return latest(posts.map((post) => post.day));
  const post = posts.find((item) => key === `${site}/blog/${item.id}`);
  if (post) return post.day;
  const tag = posts
    .flatMap((item) => item.tags.map((name) => ({ slug: tagSlug(name), day: item.day })))
    .filter((item) => key === `${site}/blog/tags/${item.slug}`);
  if (tag.length) return latest(tag.map((item) => item.day));
  return undefined;
}

// The landing page lives in public/index.html, so Astro does not know about it.
// customPages adds it to the sitemap.
export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      customPages: [`${site}/`],
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const day = lastmodFor(item.url);
        if (day) item.lastmod = new Date(`${day}T00:00:00.000Z`);
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
