import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const values = {};
for (let index = 0; index < process.argv.length - 2; index += 2) {
  const key = process.argv[index + 2];
  const value = process.argv[index + 3];
  if (!['--name', '--description', '--domain'].includes(key) || !value || values[key]) {
    console.error('Usage: npm run setup -- --name "Site Name" --description "Site description" --domain site.example.org');
    process.exit(1);
  }
  values[key] = value.trim();
}

const name = values['--name'];
const description = values['--description'];
const domain = values['--domain']?.toLowerCase();
const label = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const labels = domain?.split('.') ?? [];

if (!name || !description || !domain || domain.length > 253 || labels.length < 2 ||
    labels.some((part) => !label.test(part)) || /^\d+$/.test(labels.at(-1))) {
  console.error('Provide a name, description, and DNS domain only (for example, site.example.org).');
  process.exit(1);
}

const root = process.cwd();
const configPath = join(root, 'site.config.json');
const current = JSON.parse(readFileSync(configPath, 'utf8'));
const next = { ...current, name, description, domain };
writeFileSync(configPath, `${JSON.stringify(next, null, 2)}\n`);
writeFileSync(join(root, 'public', 'CNAME'), `${domain}\n`);
console.log(`Configured ${name} for https://${domain}`);
