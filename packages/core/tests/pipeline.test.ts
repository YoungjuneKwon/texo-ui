import { describe, expect, it } from 'vitest';
import { TexoPipeline } from '../src';
import { loadFixture, randomChunkify } from './helpers';

describe('TexoPipeline', () => {
  it('parses simple end-to-end content', () => {
    const pipeline = new TexoPipeline();
    pipeline.push('hello\n');
    pipeline.end();
    const ast = pipeline.getAST();
    expect(ast.children.length).toBeGreaterThan(0);
  });

  it('parses mixed fixture end-to-end', () => {
    const pipeline = new TexoPipeline();
    pipeline.push(loadFixture('mixed-document.md'));
    pipeline.end();
    const ast = pipeline.getAST();
    expect(ast.children.some((n) => n.type === 'directive')).toBe(true);
  });

  it('handles random chunked llm style input', () => {
    const content = loadFixture('llm-output-sample.md');
    const chunks = randomChunkify(content, 2, 10);
    const pipeline = new TexoPipeline();
    for (const chunk of chunks) {
      pipeline.push(chunk);
    }
    pipeline.end();
    expect(pipeline.getAST().children.length).toBeGreaterThan(0);
  });

  it('emits subscribe updates with dirty nodes', () => {
    const pipeline = new TexoPipeline();
    let called = 0;
    pipeline.subscribe((_ast, dirty) => {
      if (dirty.length > 0) {
        called += 1;
      }
    });
    pipeline.push('# T\n');
    pipeline.push('text\n');
    expect(called).toBeGreaterThan(0);
    expect(pipeline.getDirtyNodes().length).toBeGreaterThan(0);
  });
});
