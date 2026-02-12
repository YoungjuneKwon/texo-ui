import { describe, expect, it } from 'vitest';
import { StreamParser } from '../src';

function collect(parser: StreamParser, input: string): string[] {
  const tokens: string[] = [];
  for (const token of parser.feed(input)) {
    tokens.push(token.type);
  }
  return tokens;
}

describe('StreamParser', () => {
  it('handles empty input', () => {
    const parser = new StreamParser();
    expect(collect(parser, '')).toEqual([]);
  });

  it('parses plain text', () => {
    const parser = new StreamParser();
    const tokens = [...parser.feed('hello world'), ...parser.flush()];
    expect(tokens.some((t) => t.type === 'text')).toBe(true);
  });

  it('parses headings h1~h6', () => {
    const parser = new StreamParser();
    const tokens = [...parser.feed('# A\n## B\n### C\n#### D\n##### E\n###### F\n')];
    expect(tokens.filter((t) => t.type === 'heading')).toHaveLength(6);
  });

  it('parses code blocks', () => {
    const parser = new StreamParser();
    const tokens = [...parser.feed('```js\nconst a = 1;\n```\n')];
    expect(tokens.some((t) => t.type === 'code-block-start')).toBe(true);
    expect(tokens.some((t) => t.type === 'code-block-content')).toBe(true);
    expect(tokens.some((t) => t.type === 'code-block-end')).toBe(true);
  });

  it('parses inline markups', () => {
    const parser = new StreamParser();
    const tokens = [...parser.feed('**bold** *italic* `code`\n')];
    expect(tokens.some((t) => t.type === 'bold')).toBe(true);
    expect(tokens.some((t) => t.type === 'italic')).toBe(true);
    expect(tokens.some((t) => t.type === 'code-inline')).toBe(true);
  });

  it('parses list and blockquote and hr', () => {
    const parser = new StreamParser();
    const tokens = [...parser.feed('- item\n> quote\n---\n')];
    expect(tokens.some((t) => t.type === 'list-item')).toBe(true);
    expect(tokens.some((t) => t.type === 'blockquote')).toBe(true);
    expect(tokens.some((t) => t.type === 'hr')).toBe(true);
  });

  it('parses link and image', () => {
    const parser = new StreamParser();
    const tokens = [...parser.feed('[a](https://a.com) ![b](https://b.com)\n')];
    expect(tokens.some((t) => t.type === 'link')).toBe(true);
    expect(tokens.some((t) => t.type === 'image')).toBe(true);
  });

  it('supports chunk split inline', () => {
    const parser = new StreamParser();
    const tokens = [...parser.feed('**bo'), ...parser.feed('ld**\n')];
    expect(tokens.some((t) => t.type === 'bold')).toBe(true);
  });

  it('supports chunk split code fence', () => {
    const parser = new StreamParser();
    const tokens = [...parser.feed('``'), ...parser.feed('`\ncode\n```\n')];
    expect(tokens.some((t) => t.type === 'code-block-start')).toBe(true);
  });

  it('supports chunk split directive open', () => {
    const parser = new StreamParser();
    const tokens = [...parser.feed('::'), ...parser.feed(': card\nkey: v\n:::\n')];
    expect(tokens.some((t) => t.type === 'directive-open')).toBe(true);
  });

  it('flush emits remaining tokens', () => {
    const parser = new StreamParser();
    Array.from(parser.feed('hello'));
    const tokens = [...parser.flush()];
    expect(tokens.some((t) => t.type === 'paragraph')).toBe(true);
  });

  it('tracks position', () => {
    const parser = new StreamParser();
    const tokens = [...parser.feed('# Hello\n')];
    const heading = tokens.find((t) => t.type === 'heading');
    expect(heading?.position.line).toBe(1);
    expect(heading?.position.column).toBe(1);
  });
});
