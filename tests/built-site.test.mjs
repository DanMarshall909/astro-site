import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, sep } from 'node:path';
import test from 'node:test';

const output = join(process.cwd(), 'dist');
const { domain } = JSON.parse(readFileSync(join(process.cwd(), 'site.config.json'), 'utf8'));

function pagesIn(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const file = join(directory, entry);
    return statSync(file).isDirectory() ? pagesIn(file) : entry === 'index.html' ? [file] : [];
  });
}

test('every published page has identity, canonical metadata, and working local links', () => {
  const pages = pagesIn(output);
  assert.ok(pages.length >= 2, `Expected at least two pages, found ${pages.length}`);
  for (const page of pages) {
    const label = relative(output, page).split(sep).join('/');
    const html = readFileSync(page, 'utf8');
    assert.match(html, /<html[^>]+lang="en"/i, label);
    assert.match(html, /<title>[^<]+<\/title>/i, label);
    assert.match(html, /<meta name="description" content="[^"]+"/i, label);
    assert.ok(html.includes(`<link rel="canonical" href="https://${domain || 'example.invalid'}/`), `${label} has the wrong canonical domain`);
    assert.match(html, /<meta property="og:image" content="[^"]+\/assets\/social-card\.svg"/i, label);
    assert.match(html, /href="#main"/, label);
    for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const path = href.split(/[?#]/)[0];
      if (!path || /^(?:[a-z]+:|\/\/)/i.test(path)) continue;
      const target = path.startsWith('/') ? join(output, path) : join(dirname(page), path);
      const file = extname(target) ? target : join(target, 'index.html');
      assert.ok(existsSync(file), `${label} links to missing ${href}`);
    }
  }
});

test('build carries publishing resources only when a domain has been configured', () => {
  assert.ok(existsSync(join(output, '.nojekyll')));
  assert.ok(existsSync(join(output, 'assets', 'brand-mark.svg')));
  assert.ok(existsSync(join(output, 'assets', 'social-card.svg')));
  if (domain) {
    assert.equal(readFileSync(join(output, 'CNAME'), 'utf8'), `${domain}\n`);
  } else {
    assert.equal(existsSync(join(output, 'CNAME')), false);
  }
});
