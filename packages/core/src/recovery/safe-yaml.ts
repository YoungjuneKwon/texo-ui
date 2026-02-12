import YAML from 'yaml';

const cache = new Map<string, { result: Record<string, unknown>; error?: string }>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function safeYAMLParse(
  rawBody: string,
  fallback: Record<string, unknown> = {},
): { result: Record<string, unknown>; error?: string } {
  const cached = cache.get(rawBody);
  if (cached) {
    return cached;
  }

  const parseCandidate = (candidate: string): Record<string, unknown> => {
    const parsed = YAML.parse(candidate);
    return isRecord(parsed) ? parsed : fallback;
  };

  try {
    const result = { result: parseCandidate(rawBody) };
    cache.set(rawBody, result);
    return result;
  } catch (error) {
    const lines = rawBody.split('\n');
    for (let i = 0; i < 5; i += 1) {
      if (lines.length === 0) {
        break;
      }
      lines.pop();
      const candidate = lines.join('\n');
      if (!candidate.trim()) {
        continue;
      }

      try {
        const result = { result: parseCandidate(candidate) };
        cache.set(rawBody, result);
        return result;
      } catch {
        continue;
      }
    }

    const message = error instanceof Error ? error.message : 'Unknown YAML parse error';
    const result = { result: fallback, error: message };
    cache.set(rawBody, result);
    return result;
  }
}
