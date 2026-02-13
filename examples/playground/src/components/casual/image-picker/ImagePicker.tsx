import { useState } from 'react';
import type { DirectiveComponentProps } from '../../shared';
import { useDirectiveAction } from '../../shared';
import type { ImagePickerAttributes } from './types';

export function ImagePicker({
  attributes,
  onAction,
}: DirectiveComponentProps<ImagePickerAttributes>): JSX.Element {
  const emit = useDirectiveAction(onAction);
  const mode = attributes.mode === 'single' ? 'single' : 'multi-select';
  const options = (attributes.options ?? []).filter(
    (option): option is ImagePickerAttributes['options'][number] =>
      Boolean(option && typeof option === 'object' && typeof option.id === 'string'),
  );
  const max =
    typeof attributes.maxSelect === 'number' && Number.isFinite(attributes.maxSelect)
      ? Math.max(1, Math.floor(attributes.maxSelect))
      : 3;
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string): void => {
    const has = selected.includes(id);
    if (mode === 'single') {
      setSelected([id]);
      return;
    }
    if (!has && selected.length >= max) {
      return;
    }
    setSelected(has ? selected.filter((v) => v !== id) : [...selected, id]);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{attributes.title ?? 'Image Picker'}</h3>
      <div
        className="mt-4 grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))' }}
      >
        {options.map((option) => {
          const isOn = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggle(option.id)}
              className={`rounded-xl border bg-white p-1.5 text-left transition ${
                isOn
                  ? 'border-sky-500 ring-2 ring-sky-100'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <img
                src={option.image}
                alt={option.label}
                loading="lazy"
                className="aspect-square w-full rounded-lg object-cover"
              />
              <div className="px-1 pb-1 pt-2 text-sm font-medium text-slate-700">
                {option.label}
              </div>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => emit({ type: 'confirm', directive: 'image-picker', value: selected })}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Confirm
      </button>
    </section>
  );
}
