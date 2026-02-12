import { describe, expect, it } from 'vitest';
import process from 'node:process';
import { performance } from 'node:perf_hooks';
import { TexoPipeline } from '../src';

function makeLargeMarkdown(size = 1024 * 1024): string {
  const line = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n';
  let out = '# Bench\n';
  while (out.length < size) {
    out += line;
  }
  return out;
}

describe('benchmark', () => {
  it('parses ~1MB markdown under practical threshold', () => {
    const md = makeLargeMarkdown();
    const pipeline = new TexoPipeline();
    const start = performance.now();
    pipeline.push(md);
    pipeline.end();
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
  });

  it('parses document with 100 directives', () => {
    const directives = Array.from(
      { length: 100 },
      (_, i) => `::: card\nindex: ${i}\nvalue: ${i * 2}\n:::\n`,
    ).join('\n');
    const pipeline = new TexoPipeline();
    const start = performance.now();
    pipeline.push(directives);
    pipeline.end();
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
  });

  it('keeps memory growth bounded across runs', () => {
    const md = makeLargeMarkdown(128 * 1024);
    const before = process.memoryUsage().heapUsed;
    for (let i = 0; i < 5; i += 1) {
      const pipeline = new TexoPipeline();
      pipeline.push(md);
      pipeline.end();
    }
    const after = process.memoryUsage().heapUsed;
    expect(after - before).toBeLessThan(50 * 1024 * 1024);
  });
});
