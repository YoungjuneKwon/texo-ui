import type { ParserEvent } from '../../types';

/**
 * Basic directive tokenizer used by the streaming parser.
 * Detailed directive parsing is implemented in work item 003.
 */
export function* tokenizeDirective(
  buffer: string,
  nextChar: () => string | null,
): Generator<ParserEvent> {
  void nextChar;
  const line = buffer.trim();

  if (line === ':::') {
    yield {
      type: 'directive-close',
      raw: buffer,
      position: { line: 0, column: 0, offset: 0 },
    };
    return;
  }

  if (line.startsWith(':::')) {
    yield {
      type: 'directive-open',
      raw: buffer,
      position: { line: 0, column: 0, offset: 0 },
    };
    return;
  }

  yield {
    type: 'directive-body',
    raw: buffer,
    position: { line: 0, column: 0, offset: 0 },
  };
}
