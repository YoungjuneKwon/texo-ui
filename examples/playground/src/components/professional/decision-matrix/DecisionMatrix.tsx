import { useMemo, useState } from 'react';
import type { DirectiveComponentProps } from '../../shared';
import { useDirectiveAction } from '../../shared';
import type { DecisionMatrixAttributes, MatrixCriterion } from './types';

function normalizeWeights(criteria: MatrixCriterion[]): MatrixCriterion[] {
  const total = criteria.reduce((sum, c) => sum + c.weight, 0) || 1;
  return criteria.map((c) => ({ ...c, weight: c.weight / total }));
}

export function DecisionMatrix({
  attributes,
  onAction,
}: DirectiveComponentProps<DecisionMatrixAttributes>): JSX.Element {
  const emit = useDirectiveAction(onAction);
  const [criteria, setCriteria] = useState(normalizeWeights(attributes.criteria ?? []));

  const ranking = useMemo(() => {
    return (attributes.options ?? [])
      .map((option) => {
        const score = criteria.reduce((acc, criterion) => {
          const raw = option.scores[criterion.name] ?? 0;
          return acc + (criterion.inverse ? -raw : raw) * criterion.weight;
        }, 0);
        return { name: option.name, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [attributes.options, criteria]);

  const setWeight = (name: string, value: number): void => {
    const next = normalizeWeights(
      criteria.map((c) => (c.name === name ? { ...c, weight: value } : c)),
    );
    setCriteria(next);
    emit({
      type: 'weights-change',
      directive: 'decision-matrix',
      value: { ranking, criteria: next },
    });
  };

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h3>{attributes.title ?? 'Decision Matrix'}</h3>
      {criteria.map((criterion) => (
        <label key={criterion.name} style={{ display: 'grid', gap: 4 }}>
          {criterion.name}: {criterion.weight.toFixed(2)}
          <input
            type="range"
            min={0.01}
            max={1}
            step={0.01}
            value={criterion.weight}
            onChange={(e) => setWeight(criterion.name, Number(e.target.value))}
          />
        </label>
      ))}
      <ol>
        {ranking.map((row) => (
          <li key={row.name}>
            {row.name} — {row.score.toFixed(2)}
          </li>
        ))}
      </ol>
    </section>
  );
}
