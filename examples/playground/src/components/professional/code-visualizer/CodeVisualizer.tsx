import { useMemo, useState } from 'react';
import type { DirectiveComponentProps } from '../../shared';
import { useDirectiveAction } from '../../shared';
import type { CodeVisualizerAttributes } from './types';

export function CodeVisualizer({
  attributes,
  onAction,
}: DirectiveComponentProps<CodeVisualizerAttributes>): JSX.Element {
  const emit = useDirectiveAction(onAction);
  const type = attributes.type ?? 'regex';
  const [input, setInput] = useState(attributes.testCases?.[0]?.input ?? '');
  const [activeType, setActiveType] = useState(type);

  const matchResult = useMemo(() => {
    if (activeType !== 'regex') {
      return null;
    }
    try {
      const regex = new RegExp(attributes.code ?? '');
      return regex.test(input);
    } catch {
      return null;
    }
  }, [activeType, attributes.code, input]);

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h3>{attributes.title ?? 'Code Visualizer'}</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={() => setActiveType('regex')}>
          Regex
        </button>
        <button type="button" onClick={() => setActiveType('sql')}>
          SQL
        </button>
      </div>
      <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: 10, borderRadius: 8 }}>
        {attributes.code}
      </pre>
      {activeType === 'regex' ? (
        <>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type test input"
          />
          <p style={{ color: matchResult ? '#16a34a' : '#dc2626' }}>
            {matchResult ? 'Pass' : 'Fail'}
          </p>
        </>
      ) : (
        <p>SQL plan preview: FROM → WHERE → GROUP BY → ORDER BY</p>
      )}
      <button
        type="button"
        onClick={() =>
          emit({
            type: 'visualize',
            directive: 'code-visualizer',
            value: { type: activeType, input, matchResult },
          })
        }
      >
        Send Result
      </button>
    </section>
  );
}
