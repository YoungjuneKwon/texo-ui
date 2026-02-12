import type { ParserEvent, ParserOptions } from '../types';
import { StreamParser } from './stream-parser';

type TokenHandler = (token: ParserEvent) => void;

export function createParserStream(options?: ParserOptions): {
  push: (chunk: string) => void;
  end: () => void;
  on: (event: 'token', handler: TokenHandler) => void;
  off: (event: 'token', handler: TokenHandler) => void;
} {
  const parser = new StreamParser(options);
  const handlers = new Set<TokenHandler>();

  const emitToken = (token: ParserEvent): void => {
    for (const handler of handlers) {
      handler(token);
    }
  };

  return {
    push(chunk: string): void {
      for (const token of parser.feed(chunk)) {
        emitToken(token);
      }
    },
    end(): void {
      for (const token of parser.flush()) {
        emitToken(token);
      }
    },
    on(event: 'token', handler: TokenHandler): void {
      if (event === 'token') {
        handlers.add(handler);
      }
    },
    off(event: 'token', handler: TokenHandler): void {
      if (event === 'token') {
        handlers.delete(handler);
      }
    },
  };
}
