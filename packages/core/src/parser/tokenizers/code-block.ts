export interface CodeFenceMatch {
  language?: string;
}

export function parseCodeFence(line: string): CodeFenceMatch | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith('```')) {
    return null;
  }

  const language = trimmed.slice(3).trim();
  return {
    language: language.length > 0 ? language : undefined,
  };
}

export function isCodeFence(line: string): boolean {
  return parseCodeFence(line) !== null;
}
