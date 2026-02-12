import type { ParserEvent, Position } from '../../types';

export interface HeadingMatch {
  depth: number;
  text: string;
}

export function parseHeading(line: string): HeadingMatch | null {
  const match = /^(#{1,6})\s+(.*)$/.exec(line);
  if (!match) {
    return null;
  }

  return {
    depth: match[1].length,
    text: match[2],
  };
}

export function createHeadingEvent(line: string, position: Position): ParserEvent | null {
  const heading = parseHeading(line);
  if (!heading) {
    return null;
  }

  return {
    type: 'heading',
    raw: line,
    position,
  };
}
