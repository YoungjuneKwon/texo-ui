import { useMemo } from 'react';
import type { DirectiveComponentProps } from '../../shared';
import { useDirectiveAction } from '../../shared';
import type { SettlementAttributes } from './types';

export function SettlementCalculator({
  attributes,
  onAction,
}: DirectiveComponentProps<SettlementAttributes>): JSX.Element {
  const emit = useDirectiveAction(onAction);

  const result = useMemo(() => {
    const participants = attributes.participants ?? [];
    const weights = participants.map((p) => {
      const multiplier = p.conditions.reduce((acc, condition) => {
        const rule = attributes.rules?.find((r) => r.condition === condition);
        return acc * (rule?.multiplier ?? 1);
      }, 1);
      return { name: p.name, multiplier };
    });
    const totalWeight = weights.reduce((sum, row) => sum + row.multiplier, 0) || 1;
    return weights.map((row) => ({
      ...row,
      amount: (attributes.totalAmount * row.multiplier) / totalWeight,
    }));
  }, [attributes.participants, attributes.rules, attributes.totalAmount]);

  return (
    <section style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16 }}>
      <h3>{attributes.title ?? 'Settlement Calculator'}</h3>
      <ul>
        {result.map((row) => (
          <li key={row.name}>
            {row.name}: {Math.round(row.amount).toLocaleString()} {attributes.currency ?? 'KRW'}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() =>
          emit({ type: 'settlement', directive: 'settlement-calculator', value: result })
        }
      >
        Share Result
      </button>
    </section>
  );
}
