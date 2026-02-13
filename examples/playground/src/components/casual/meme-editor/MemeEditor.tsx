import { useEffect, useMemo, useState } from 'react';
import type { DirectiveComponentProps } from '../../shared';
import { useDirectiveAction } from '../../shared';
import type { MemeEditorAttributes } from './types';

export function MemeEditor({
  attributes,
  onAction,
}: DirectiveComponentProps<MemeEditorAttributes>): JSX.Element {
  const emit = useDirectiveAction(onAction);
  const safeTextBoxes = useMemo(
    () =>
      (Array.isArray(attributes.textBoxes) ? attributes.textBoxes : [])
        .filter((box): box is NonNullable<MemeEditorAttributes['textBoxes']>[number] => {
          return Boolean(box && typeof box === 'object');
        })
        .map((box) => ({
          text: typeof box.text === 'string' ? box.text : '',
          position: box.position,
          fontSize: typeof box.fontSize === 'number' ? box.fontSize : undefined,
          color: typeof box.color === 'string' ? box.color : undefined,
        })),
    [attributes.textBoxes],
  );
  const [texts, setTexts] = useState(safeTextBoxes);
  const size = useMemo(
    () => ({ width: attributes.width ?? 600, height: attributes.height ?? 400 }),
    [attributes.height, attributes.width],
  );

  useEffect(() => {
    setTexts(safeTextBoxes);
  }, [safeTextBoxes]);

  const updateText = (idx: number, text: string): void => {
    setTexts((prev) => prev.map((row, i) => (i === idx ? { ...row, text } : row)));
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Meme Editor</h3>
      <div
        className="relative mt-4 w-full overflow-hidden rounded-xl border border-slate-200"
        style={{
          maxWidth: size.width,
          aspectRatio: `${size.width}/${size.height}`,
          background: attributes.backgroundImage
            ? `url(${attributes.backgroundImage}) center/cover`
            : '#111',
        }}
      >
        {texts.map((box, idx) => (
          <input
            key={`meme-text-${idx}`}
            value={box.text}
            onChange={(e) => updateText(idx, e.target.value)}
            className="absolute left-[10%] right-[10%] border border-dashed border-white/50 bg-black/15 px-2 py-1 text-center font-semibold text-white outline-none placeholder:text-white/70"
            style={{
              top: box.position === 'top' ? '8%' : box.position === 'bottom' ? '80%' : '45%',
              color: box.color ?? '#fff',
              fontSize: box.fontSize ?? 28,
            }}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={() => emit({ type: 'download', directive: 'meme-editor', value: texts })}
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Download PNG
      </button>
    </section>
  );
}
