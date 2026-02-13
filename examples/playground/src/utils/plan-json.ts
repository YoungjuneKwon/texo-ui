export function extractJSONObject(source: string): string | null {
  const first = source.indexOf('{');
  const last = source.lastIndexOf('}');
  if (first < 0 || last < 0 || last <= first) {
    return null;
  }
  return source.slice(first, last + 1);
}
