import { useMemo, useState } from 'react';
import type { DirectiveComponentProps } from '../../shared';
import { useDirectiveAction } from '../../shared';
import type { TarotDeckAttributes } from './types';

const CARD_BACK = '✦';

export function TarotDeck({
  attributes,
  status,
  onAction,
}: DirectiveComponentProps<TarotDeckAttributes>): JSX.Element {
  const emit = useDirectiveAction(onAction);
  const count = attributes.cardCount ?? 3;
  const mode = attributes.mode ?? 'pick';
  const [picked, setPicked] = useState<number[]>([]);
  const placeholders = useMemo(
    () => Array.from({ length: Math.max(3, count) }, (_, i) => i),
    [count],
  );

  const togglePick = (idx: number): void => {
    if (mode !== 'pick') {
      return;
    }
    const has = picked.includes(idx);
    const next = has
      ? picked.filter((v) => v !== idx)
      : picked.length < count
        ? [...picked, idx]
        : picked;
    setPicked(next);
    if (next.length === count) {
      emit({ type: 'pick-complete', directive: 'tarot-deck', value: next });
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Tarot Deck · {mode}</h3>
      <p className="mt-1 text-sm text-slate-500">
        Spread: {attributes.spread ?? 'three-card'} · {status}
      </p>
      <div
        className="mt-4 grid gap-2.5"
        style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))' }}
      >
        {(mode === 'reveal' ? (attributes.cards ?? []) : placeholders).map((card, idx) => {
          const revealed = mode === 'reveal';
          const selected = picked.includes(idx);
          return (
            <button
              key={`tarot-${idx}`}
              type="button"
              onClick={() => togglePick(idx)}
              className={`min-h-36 rounded-xl border px-2 py-3 text-white transition ${
                selected ? 'border-sky-500 ring-2 ring-sky-100' : 'border-violet-300'
              }`}
              style={{
                background: revealed ? '#111827' : '#312e81',
                transform:
                  revealed && (card as { reversed?: boolean }).reversed ? 'rotate(180deg)' : 'none',
                transition: 'transform .5s ease, opacity .3s ease',
              }}
            >
              {revealed ? (
                <>
                  <div className="font-medium">{(card as { name?: string }).name}</div>
                  <small className="mt-1 block text-xs text-slate-200">
                    {(card as { meaning?: string }).meaning}
                  </small>
                </>
              ) : (
                <span className="text-3xl">{CARD_BACK}</span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
