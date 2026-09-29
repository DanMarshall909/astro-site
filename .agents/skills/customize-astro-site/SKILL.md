---
name: customize-astro-site
description: 'Use after cloning astro-site to create a distinct Astro website with its own content, visual identity, domain, and GitHub Pages deployment.'
---

# Customize this Astro site

Turn the starter into the requested project's website. Read `README.md`, the
user's project brief, and any existing product docs or site before editing.
If the site is for another repository, treat that repository's terminology,
examples, commands, and brand as the content source. Do not copy its build
system into this website unless the content genuinely depends on it.

## 1. Capture the site brief

Use `templates/site-brief.md` to identify audience, first action, required
pages, source material, visual direction, and the custom domain. Ask only for
choices that source material and user intent cannot settle. The custom domain
must be supplied by the owner before publishing. Avoid a generic site when
real project details are available.

## 2. Configure identity and domain

Run:

```bash
npm ci
npm run setup -- --name "Project Name" --description "A useful summary of this site." --domain project.example.org
```

The setup command updates `site.config.json` and creates `public/CNAME`.
Review both files. Keep `astro.config.mjs` on `https://<domain>` without a
repository `base` path. Update navigation as pages change. If the project will
publish at a GitHub URL rather than a custom domain, adapt the publishing
contract explicitly, including Astro `base` and links, before deployment.

## 3. Build the actual site

Use `src/layouts/BaseLayout.astro`, `src/components/`, and
`src/assets/styles/global.css` as the shared page system. Replace the example
copy in `src/pages/`; add pages with `templates/page.astro` as a starting shape.
Keep the first screen clear about the site's purpose and primary action.

Put reusable visual resources in `public/assets/` when their URL must be stable
(favicon, social card, downloadable or referenced images). Put imported styles
and images in `src/assets/` so Astro can process them. Replace the starter mark,
hero art, and social card with project assets; remove examples that no longer
serve the site. Use meaningful alt text for informative images and empty alt
text for decoration. Keep navigation keyboard usable, contrast readable, and
small screens intentional.

For a blog, use Astro content collections for posts and keep article media
near its source or in `src/assets/`, with a clear URL strategy for downloads.
For documentation, verify rendered examples against the project's current
commands/API and add content checks when generated examples are involved.
For a small landing site, retain only the pages and components it needs.

## 4. Verify the complete output

Run `npm test` and `npm run check:configured`. Review the generated pages in
`dist/`, including mobile width, keyboard navigation, and the final metadata.
The built-site test checks page metadata, internal links, `.nojekyll`, assets,
and the built `CNAME`. Add focused tests for site-specific claims and generated
content. Keep checks in the Pages workflow.

## 5. Publish with GitHub Pages

Once the owner has authorized publication, push to the site's own repository.
In its GitHub Pages settings choose **GitHub Actions** as the source and set the
same custom domain as `site.config.json`. Configure DNS at the domain provider
and verify HTTPS and live links after deployment. The source and built `CNAME`
files are retained for consistency; GitHub ignores `CNAME` files for custom
Actions workflows, so the Pages custom-domain setting is essential.
