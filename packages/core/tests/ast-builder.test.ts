import { describe, expect, it } from 'vitest';
import { ASTBuilder, StreamParser, TexoPipeline } from '../src';

describe('ASTBuilder', () => {
  it('creates root for empty doc', () => {
    const builder = new ASTBuilder();
    expect(builder.getTree().type).toBe('root');
    expect(builder.getTree().children).toHaveLength(0);
  });

  it('builds mixed document tree', () => {
    const parser = new StreamParser();
    const builder = new ASTBuilder();
    const text = '# Title\npara\n::: card\na: 1\n:::\n```ts\nconst a = 1;\n```\n';
    for (const token of parser.feed(text)) {
      builder.addToken(token);
    }
    builder.handleStreamEnd();
    const tree = builder.getTree();
    expect(tree.children.some((n) => n.type === 'heading')).toBe(true);
    expect(tree.children.some((n) => n.type === 'directive')).toBe(true);
    expect(tree.children.some((n) => n.type === 'code-block')).toBe(true);
  });

  it('keeps deterministic IDs for same input', () => {
    const makeTree = () => {
      const parser = new StreamParser();
      const builder = new ASTBuilder();
      for (const token of parser.feed('# A\ntext\n')) {
        builder.addToken(token);
      }
      return builder.getTree();
    };

    const tree1 = makeTree();
    const tree2 = makeTree();
    expect(tree1.children.map((n) => n.id)).toEqual(tree2.children.map((n) => n.id));
  });

  it('returns only dirty nodes', () => {
    const parser = new StreamParser();
    const builder = new ASTBuilder();
    for (const token of parser.feed('# A\n')) {
      builder.addToken(token);
    }
    const dirty = builder.getDirtyNodes();
    expect(dirty.length).toBeGreaterThan(0);
  });

  it('publishes subscribe callbacks via pipeline', () => {
    const pipeline = new TexoPipeline();
    const events: number[] = [];
    pipeline.subscribe((_ast, dirty) => {
      events.push(dirty.length);
    });
    pipeline.push('# A\n');
    expect(events.length).toBeGreaterThan(0);
  });

  it('resets to empty tree', () => {
    const pipeline = new TexoPipeline();
    pipeline.push('hello\n');
    expect(pipeline.getAST().children.length).toBeGreaterThan(0);
    pipeline.reset();
    expect(pipeline.getAST().children).toHaveLength(0);
  });
});
