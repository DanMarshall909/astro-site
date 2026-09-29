# Astro site starter

A reusable Astro website for a project, blog, or documentation home. Create a
new repository from this template, open it with a coding agent, and ask it to
follow `AGENTS.md`. The agent's local skill is
[customize-astro-site](.agents/skills/customize-astro-site/SKILL.md).

## Start a new site

1. Create a new repository from this GitHub template, or clone this repository
   and replace its Git remote with your new site's repository.
2. Open the new repository with a coding agent and give it the project name,
   source repository, desired site, and custom domain. It should follow
   `AGENTS.md` and `templates/site-brief.md`.
3. Run `npm ci`, then configure the site:

   ```bash
   npm run setup -- --name "Project Name" --description "A useful summary of this site." --domain project.example.org
   npm test
   npm run check:configured
   npm run dev
   ```

4. Review the content and design, then publish. In GitHub **Settings → Pages**,
   select **GitHub Actions** and set the custom domain to the same value. Set
   DNS with your provider. The workflow verifies pull requests and deploys
   configured `main` pushes.

The template is intentionally unconfigured. Until setup supplies a domain,
Astro uses `example.invalid` for local canonical URLs, the build contains no
`CNAME`, and the deployment job skips publishing. `public/CNAME` is generated
by setup and copied to `dist/CNAME` by Astro. GitHub Pages ignores that file
for custom Actions deployments, so its Pages domain setting must also be set.

## Where things go

| Path | Purpose |
| --- | --- |
| `site.config.json` | Site name, description, custom domain, navigation |
| `src/pages/` | Routes and page-specific content |
| `src/layouts/`, `src/components/` | Shared page structures |
| `src/assets/styles/` | Shared design tokens and styles processed by Astro |
| `public/assets/` | Stable URL assets: site mark, hero art, social card, downloads |
| `templates/` | Site brief and page starting shape |
| `.agents/skills/` | Instructions for customizing a cloned site |

The Pages workflow runs `npm test` before deployment. That checks setup
behavior, builds the site, and tests metadata, internal links, and publishing
resources. Add content tests for claims, examples, and synchronized data that
matter to your project.

Deployment setup follows the [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/).
GitHub's [custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
explains why the repository setting is required for an Actions deployment.
