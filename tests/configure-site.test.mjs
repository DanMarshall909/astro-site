import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const script = resolve('scripts/configure-site.mjs');
const checkScript = resolve('scripts/check-configured.mjs');

function fixture(t) {
  const directory = mkdtempSync(join(tmpdir(), 'astro-site-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  mkdirSync(join(directory, 'public'));
  writeFileSync(join(directory, 'site.config.json'), JSON.stringify({
    name: 'Your Site', description: 'Starter description', domain: '', navigation: [],
  }));
  return directory;
}

function configure(directory, ...args) {
  return spawnSync(process.execPath, [script, ...args], { cwd: directory, encoding: 'utf8' });
}

test('setup writes one custom domain and the site identity', (t) => {
  const directory = fixture(t);
  const result = configure(directory,
    '--name', 'Project Atlas',
    '--description', 'Documentation and updates for Project Atlas.',
    '--domain', 'Atlas.Example.org');

  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(readFileSync(join(directory, 'site.config.json'), 'utf8')), {
    name: 'Project Atlas',
    description: 'Documentation and updates for Project Atlas.',
    domain: 'atlas.example.org',
    navigation: [],
  });
  assert.equal(readFileSync(join(directory, 'public', 'CNAME'), 'utf8'), 'atlas.example.org\n');
});

test('setup rejects URL-shaped and invalid domains without changing files', (t) => {
  for (const domain of ['https://example.org', 'example.org/path', 'bad_domain.org', 'localhost']) {
    const directory = fixture(t);
    const before = readFileSync(join(directory, 'site.config.json'), 'utf8');
    const result = configure(directory, '--name', 'Atlas', '--description', 'A useful site.', '--domain', domain);

    assert.notEqual(result.status, 0, domain);
    assert.match(result.stderr, /domain/i);
    assert.equal(readFileSync(join(directory, 'site.config.json'), 'utf8'), before);
    assert.equal(existsSync(join(directory, 'public', 'CNAME')), false);
  }
});

test('publishing check rejects a missing or mismatched built CNAME', (t) => {
  const directory = fixture(t);
  assert.equal(configure(directory, '--name', 'Atlas', '--description', 'A useful site.', '--domain', 'atlas.example.org').status, 0);
  mkdirSync(join(directory, 'dist'));

  const missing = spawnSync(process.execPath, [checkScript], { cwd: directory, encoding: 'utf8' });
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /dist\/CNAME/);

  writeFileSync(join(directory, 'dist', 'CNAME'), 'wrong.example.org\n');
  const mismatched = spawnSync(process.execPath, [checkScript], { cwd: directory, encoding: 'utf8' });
  assert.notEqual(mismatched.status, 0);
  assert.match(mismatched.stderr, /dist\/CNAME/);

  writeFileSync(join(directory, 'dist', 'CNAME'), 'atlas.example.org\n');
  const valid = spawnSync(process.execPath, [checkScript], { cwd: directory, encoding: 'utf8' });
  assert.equal(valid.status, 0, valid.stderr);
});
