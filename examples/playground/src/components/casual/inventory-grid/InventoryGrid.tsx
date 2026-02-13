import { useMemo, useState } from 'react';
import type { DirectiveComponentProps } from '../../shared';
import { useDirectiveAction } from '../../shared';
import type { InventoryGridAttributes, InventoryItem, Rarity } from './types';

const rarityBorder: Record<Rarity, string> = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b',
};

export function InventoryGrid({
  attributes,
  onAction,
}: DirectiveComponentProps<InventoryGridAttributes>): JSX.Element {
  const emit = useDirectiveAction(onAction);
  const [dragging, setDragging] = useState<InventoryItem | null>(null);
  const columns = attributes.columns ?? 4;
  const slots = attributes.slots ?? 16;
  const items = attributes.items ?? [];
  const slotItems = useMemo(() => new Map(items.map((item) => [item.slot, item])), [items]);

  const triggerAction = (action: string): void => {
    if (!dragging) {
      return;
    }
    emit({ type: action, directive: 'inventory-grid', value: { item: dragging.id, action } });
    setDragging(null);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Inventory Grid</h3>
      <div
        className="mt-4 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: slots }, (_, slot) => {
          const item = slotItems.get(slot);
          return (
            <div
              key={`slot-${slot}`}
              draggable={Boolean(item)}
              onDragStart={() => item && setDragging(item)}
              className="relative grid aspect-square place-items-center rounded-xl bg-slate-50"
              style={{
                border: item ? `2px solid ${rarityBorder[item.rarity]}` : '1px dashed #d1d5db',
              }}
              title={item ? `${item.name} · ${item.description ?? ''}` : 'Empty slot'}
            >
              <span className="text-2xl">{item?.icon ?? ''}</span>
              {item ? (
                <small className="absolute bottom-1 right-1.5 rounded-md bg-white/80 px-1.5 py-0.5 text-xs font-semibold text-slate-700">
                  {item.quantity}
                </small>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(attributes.actions ?? ['use', 'drop', 'inspect']).map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => triggerAction(action)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {action}
          </button>
        ))}
      </div>
    </section>
  );
}
