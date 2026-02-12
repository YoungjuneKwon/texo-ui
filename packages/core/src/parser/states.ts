export type ParserState =
  | 'IDLE'
  | 'TEXT'
  | 'HEADING'
  | 'CODE_BLOCK'
  | 'DIRECTIVE_OPEN'
  | 'DIRECTIVE_BODY'
  | 'LIST'
  | 'BLOCKQUOTE';

export const DEFAULT_STATE: ParserState = 'IDLE';
