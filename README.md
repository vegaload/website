# vegaload.ai

The VegaLoad website. It has two parts:

- **The landing page.** It is one static file: `public/index.html`. Astro copies it as it is.
- **The blog.** It is an [Astro](https://astro.build) site. Posts are Markdown files in `src/content/blog`.

This repo is public. Do not put internal plans, drafts of announcements, dates or launch wording in it.

## Run it on your computer

You need Node 22 or newer (see `.nvmrc`).

```bash
npm ci
npm run dev        # http://localhost:4321, shows draft posts
npm run build      # writes the site to dist/
npm run check      # checks types and content
```

## Write a post

1. Copy `src/content/blog/_post-template.md` to a new file, for example `src/content/blog/my-post.md`. The file name becomes the address: `/blog/my-post/`.
2. Fill in the front matter:

   | Field | Meaning |
   | --- | --- |
   | `title` | The post title. |
   | `seoTitle` | Optional. A shorter title for the browser tab, up to 60 characters. The page heading keeps `title`. |
   | `image` | Optional. A file in `public/`, for example `/og-default.png`. Shown when the link is shared. |
   | `description` | One or two sentences, up to 200 characters. It shows in the list, in search results and in shared links. |
   | `date` | The publish date, `YYYY-MM-DD`. |
   | `updated` | Optional. The date you last changed the post. |
   | `author` | Default: `The VegaLoad team`. |
   | `tags` | A list, for example `[release-notes, sftp]`. Each tag gets its own page. |
   | `draft` | `true` hides the post from the live site. It still shows in `npm run dev`. |

3. Write the post in Markdown. Use short, simple sentences. Every command in a post must run on a released version of VegaLoad.
4. Run `npm run dev` and read the post in your browser.
5. Set `draft: false`, open a pull request, and merge it. The site deploys by itself.

Files whose name starts with an underscore are ignored, so `_post-template.md` never shows on the site.

Images go in `public/blog/` and are used as `![Alt text](/blog/my-image.png)`. Write real alt text.

## How it deploys

`.github/workflows/deploy.yml` builds the site on every pull request. On a merge to `main`, it also publishes to GitHub Pages.

In the repo settings, Pages must use **GitHub Actions** as the source.

The custom domain `vegaload.ai` is set in Settings, Pages. `public/CNAME` keeps the name in the repo.

## What is where

| Path | What it is |
| --- | --- |
| `public/index.html` | The landing page. |
| `public/` | Files copied as they are: icon, `robots.txt`, `CNAME`. |
| `src/content/blog/` | Blog posts. |
| `src/content.config.ts` | The fields a post must have. |
| `src/layouts/BaseLayout.astro` | Page head, top bar and footer for blog pages. |
| `src/styles/global.css` | Colors, fonts and text styles. They match the landing page. |
| `src/pages/` | The blog list, the post page, the tag pages, the RSS feed and the 404 page. |

The sitemap is made at build time: `/sitemap-index.xml`. The RSS feed is `/rss.xml`.

## When you change the top bar or footer

The landing page and the blog pages have their own copy of the top bar and the footer. If you change a link in one, change it in the other.
