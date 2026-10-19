import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getPublishedPosts, type Post } from './posts';

const site = 'https://vegaload.ai';

const summary = `VegaLoad is an open-source load tester for agentic developers, sponsored by Harness. You run it from the terminal, or you ask your coding agent to write the test and run it.

The main parts:

- vegaload init sets up Claude Code and Cursor with skill files and an MCP server.
- One binary speaks HTTP/1.1, HTTP/2, gRPC, WebSocket, MQTT, Kafka, PostgreSQL, MySQL, Redis, RabbitMQ, FTP, SFTP, TCP, and UDP.
- A threshold fails the run with exit code 3. A saved run can be a baseline for later comparisons.
- Localhost is allowed. Any other host needs approval. Runs are written to ~/.vegaload/audit.log.
- Each run writes a self-contained HTML report that opens offline.
- Native binaries for macOS, Linux, and Windows, plus a container image and a Helm chart.`;

function postBody(post: Post): string {
  if (post.body?.trim()) return post.body.trim();
  const raw = readFileSync(join(process.cwd(), 'src/content/blog', `${post.id}.md`), 'utf8');
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, '').trim();
}

function postUrl(post: Post): string {
  return `${site}/blog/${post.id}/`;
}

export async function llmsIndex(): Promise<string> {
  const posts = await getPublishedPosts();
  const postLines = posts.map(
    (post) => `- [${post.data.title}](${postUrl(post)}): ${post.data.description}`,
  );
  const sections = [
    '# VegaLoad',
    '',
    '> Open-source load testing for agentic developers, sponsored by Harness.',
    '',
    summary,
    '',
    '## Pages',
    '',
    `- [Home](${site}/): Product overview.`,
    `- [Blog](${site}/blog/): News, release notes, and guides.`,
    ...postLines,
    '',
    '## Docs',
    '',
    '- [Documentation](https://vegaload.github.io/vegaload/): Install, protocols, and guides.',
    '- [Install](https://vegaload.github.io/vegaload/get-started/install): How to install VegaLoad.',
    '',
    '## Optional',
    '',
    `- [RSS](${site}/rss.xml): Blog feed.`,
    `- [Full text](${site}/llms-full.txt): This site in one file.`,
    '- [GitHub](https://github.com/vegaload/vegaload): Source code.',
    '',
  ];
  return sections.join('\n');
}

export async function llmsFull(): Promise<string> {
  const posts = await getPublishedPosts();
  const parts = [
    '# VegaLoad',
    '',
    summary,
    '',
    `Home: ${site}/`,
    `Docs: https://vegaload.github.io/vegaload/`,
    '',
  ];
  for (const post of posts) {
    const date = post.data.date.toISOString().slice(0, 10);
    parts.push(
      '---',
      '',
      `# ${post.data.title}`,
      '',
      post.data.description,
      '',
      `URL: ${postUrl(post)}`,
      `Published: ${date}`,
      `Author: ${post.data.author}`,
      '',
      postBody(post),
      '',
    );
  }
  return parts.join('\n');
}
