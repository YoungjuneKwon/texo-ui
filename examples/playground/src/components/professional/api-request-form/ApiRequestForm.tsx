import { useMemo, useState } from 'react';
import type { DirectiveComponentProps } from '../../shared';
import { useDirectiveAction } from '../../shared';
import type { ApiRequestFormAttributes } from './types';

export function ApiRequestForm({
  attributes,
  onAction,
}: DirectiveComponentProps<ApiRequestFormAttributes>): JSX.Element {
  const emit = useDirectiveAction(onAction);
  const [method, setMethod] = useState(attributes.method ?? 'GET');
  const [path, setPath] = useState(attributes.path ?? '/');
  const [bodyText, setBodyText] = useState('{}');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  const url = useMemo(() => `${attributes.baseUrl ?? ''}${path}`, [attributes.baseUrl, path]);

  const send = async (): Promise<void> => {
    setLoading(true);
    const start = performance.now();
    try {
      const response = await fetch(url, {
        method,
        headers: attributes.headers,
        body: method === 'GET' || method === 'DELETE' ? undefined : bodyText,
      });
      const text = await response.text();
      setResponseText(text);
      emit({
        type: 'request-sent',
        directive: 'api-request-form',
        value: {
          request: { method, url, body: bodyText },
          response: {
            status: response.status,
            elapsedMs: Math.round(performance.now() - start),
            body: text,
          },
        },
      });
    } catch (error) {
      setResponseText(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h3>{attributes.title ?? 'API Request Form'}</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <select value={method} onChange={(e) => setMethod(e.target.value as typeof method)}>
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <input value={path} onChange={(e) => setPath(e.target.value)} style={{ flex: 1 }} />
        <button type="button" onClick={() => void send()} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <textarea
        value={bodyText}
        onChange={(e) => setBodyText(e.target.value)}
        rows={6}
        style={{ width: '100%', marginTop: 8 }}
      />
      <pre
        style={{
          background: '#111',
          color: '#d1fae5',
          padding: 10,
          borderRadius: 8,
          overflow: 'auto',
        }}
      >
        {responseText || 'No response yet'}
      </pre>
    </section>
  );
}
