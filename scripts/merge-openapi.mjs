import fs from 'node:fs';
import path from 'node:path';

const [, , ...args] = process.argv;
const output = args.at(-1);
const inputs = args.slice(0, -1);

const merged = {
  openapi: '3.0.0',
  info: {
    title: 'McMasterful Books APIs',
    version: '1.0.0'
  },
  servers: [{ url: '/api' }],
  paths: {},
  components: { schemas: {} },
  tags: []
};

for (const input of inputs) {
  const spec = JSON.parse(fs.readFileSync(input, 'utf8'));
  Object.assign(merged.paths, spec.paths ?? {});
  Object.assign(merged.components.schemas, spec.components?.schemas ?? {});
  for (const tag of spec.tags ?? []) {
    if (!merged.tags.some((existing) => existing.name === tag.name)) {
      merged.tags.push(tag);
    }
  }
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(merged, null, 2));
