import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const { domain } = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));
for (const file of ['public/CNAME', 'dist/CNAME']) {
  if (!domain || !existsSync(join(root, file)) || readFileSync(join(root, file), 'utf8') !== `${domain}\n`) {
    console.error(`Expected ${file} to contain the configured domain. Run npm run setup, then npm run build.`);
    process.exit(1);
  }
}
console.log(`Verified custom domain ${domain} in source and build output.`);
