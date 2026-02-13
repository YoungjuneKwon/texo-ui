import { useEffect, useMemo, useState } from 'react';
import type { DirectiveComponentProps } from '../../shared';
import { useDirectiveAction } from '../../shared';
import type { TournamentBracketAttributes } from './types';

function pairItems(items: string[]): string[][] {
  const pairs: string[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push([items[i], items[i + 1]].filter(Boolean) as string[]);
  }
  return pairs;
}

export function TournamentBracket({
  attributes,
  status,
  onAction,
}: DirectiveComponentProps<TournamentBracketAttributes>): JSX.Element {
  const emit = useDirectiveAction(onAction);
  const initialItems = useMemo(
    () =>
      (Array.isArray(attributes.items) ? attributes.items : []).filter(
        (item): item is string => typeof item === 'string' && item.length > 0,
      ),
    [attributes.items],
  );
  const [current, setCurrent] = useState<string[]>(initialItems);
  const [winners, setWinners] = useState<string[]>([]);
  const pairs = useMemo(() => pairItems(current), [current]);

  useEffect(() => {
    setCurrent(initialItems);
    setWinners([]);
  }, [initialItems]);

  const pickWinner = (winner: string): void => {
    const nextWinners = [...winners, winner];
    setWinners(nextWinners);
    if (nextWinners.length >= pairs.length) {
      if (nextWinners.length === 1) {
        emit({ type: 'winner', directive: 'tournament-bracket', value: nextWinners[0] });
      }
      setCurrent(nextWinners);
      setWinners([]);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        {attributes.title ?? 'Tournament Bracket'}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Round {Math.max(1, attributes.round ?? Math.log2(Math.max(current.length, 1)))} · {status}
      </p>
      <div className="mt-4 grid gap-3">
        {pairs.map((pair, idx) => (
          <div key={`pair-${idx}`} className="grid grid-cols-2 gap-2">
            {pair.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => pickWinner(item)}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                {item}
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
