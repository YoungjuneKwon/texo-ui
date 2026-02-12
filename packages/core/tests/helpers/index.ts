import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RootNode, TexoPipeline } from '../../src';

const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.slice(0, __filename.lastIndexOf('/'));

export function chunkify(text: string, chunkSize: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

export function randomChunkify(text: string, minSize = 2, maxSize = 10): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
    chunks.push(text.slice(i, i + size));
    i += size;
  }
  return chunks;
}

export function feedAll(pipeline: TexoPipeline, chunks: string[]): RootNode {
  for (const chunk of chunks) {
    pipeline.push(chunk);
  }
  pipeline.end();
  return pipeline.getAST();
}

export function loadFixture(name: string): string {
  const fixturePath = join(__dirname, '..', 'fixtures', name);
  return readFileSync(fixturePath, 'utf8');
}
