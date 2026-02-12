export function isBlockquote(line: string): boolean {
  return /^\s*>\s?/.test(line);
}
