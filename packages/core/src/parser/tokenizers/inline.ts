import type { ParserEvent, Position, TokenType } from '../../types';

const INLINE_PATTERN =
  /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;

function tokenTypeForMatch(match: RegExpExecArray): TokenType {
  if (match[1] !== undefined) {
    return 'image';
  }
  if (match[3] !== undefined) {
    return 'link';
  }
  if (match[5] !== undefined) {
    return 'bold';
  }
  if (match[6] !== undefined) {
    return 'italic';
  }
  return 'code-inline';
}

function createPosition(base: Position, line: string, index: number): Position {
  const offsetDelta = index;
  return {
    line: base.line,
    column: base.column + index,
    offset: base.offset + offsetDelta,
  };
}

export function tokenizeInline(line: string, position: Position): ParserEvent[] {
  const events: ParserEvent[] = [];
  let cursor = 0;
  INLINE_PATTERN.lastIndex = 0;

  for (let match = INLINE_PATTERN.exec(line); match; match = INLINE_PATTERN.exec(line)) {
    const index = match.index;

    if (index > cursor) {
      const rawText = line.slice(cursor, index);
      events.push({
        type: 'text',
        raw: rawText,
        position: createPosition(position, line, cursor),
      });
    }

    events.push({
      type: tokenTypeForMatch(match),
      raw: match[0],
      position: createPosition(position, line, index),
    });

    cursor = index + match[0].length;
  }

  if (cursor < line.length) {
    events.push({
      type: 'text',
      raw: line.slice(cursor),
      position: createPosition(position, line, cursor),
    });
  }

  if (events.length === 0 && line.length > 0) {
    events.push({
      type: 'text',
      raw: line,
      position,
    });
  }

  return events;
}
