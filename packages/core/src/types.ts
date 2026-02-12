export type TextChunk = string;

export type TokenType =
  | 'text'
  | 'heading'
  | 'paragraph'
  | 'bold'
  | 'italic'
  | 'code-inline'
  | 'code-block-start'
  | 'code-block-end'
  | 'code-block-content'
  | 'list-item'
  | 'blockquote'
  | 'hr'
  | 'link'
  | 'image'
  | 'newline'
  | 'directive-open'
  | 'directive-close'
  | 'directive-body'
  | 'unknown';

export interface Position {
  line: number;
  column: number;
  offset: number;
}

export interface ParserEvent {
  type: TokenType;
  raw: string;
  position: Position;
}

export interface ParserOptions {
  emitInlineTokens?: boolean;
  maxBufferSize?: number;
  onBufferOverflow?: (position: Position) => void;
}
