import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

const { domain } = JSON.parse(readFileSync(new URL('./site.config.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: domain ? `https://${domain}` : 'https://example.invalid',
  trailingSlash: 'always',
});
