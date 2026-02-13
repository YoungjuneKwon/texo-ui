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
  const count =
    typeof attributes.cardCount === 'number' && Number.isFinite(attributes.cardCount)
      ? Math.max(1, Math.floor(attributes.cardCount))
      : 3;
  const mode = attributes.mode === 'reveal' ? 'reveal' : 'pick';
  const [picked, setPicked] = useState<number[]>([]);
  const revealCards = useMemo(
    () =>
      (Array.isArray(attributes.cards) ? attributes.cards : []).filter(
        (card): card is NonNullable<TarotDeckAttributes['cards']>[number] => {
          return Boolean(card && typeof card === 'object');
        },
      ),
    [attributes.cards],
  );
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
        {(mode === 'reveal' ? revealCards : placeholders).map((card, idx) => {
          const cardData = card && typeof card === 'object' ? card : undefined;
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
                transform: revealed && cardData?.reversed ? 'rotate(180deg)' : 'none',
                transition: 'transform .5s ease, opacity .3s ease',
              }}
            >
              {revealed ? (
                <>
                  <div className="font-medium">{cardData?.name ?? 'Unknown card'}</div>
                  <small className="mt-1 block text-xs text-slate-200">
                    {cardData?.meaning ?? ''}
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
