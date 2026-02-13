import React from 'react';
import { useTexoContext } from '@texo-ui/react';

const shellStyle: React.CSSProperties = {
  border: '1px solid var(--texo-theme-line, #d1d5db)',
  borderRadius: 'var(--texo-theme-radius, 12px)',
  background: 'var(--texo-theme-background, #ffffff)',
  color: 'var(--texo-theme-foreground, #0f172a)',
  padding: 12,
};

function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : [];
}

function asRecordArray(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value)
    ? value.filter(
        (entry): entry is Record<string, unknown> => typeof entry === 'object' && entry !== null,
      )
    : [];
}

export function TexoStack(props: Record<string, unknown>): React.ReactElement {
  const direction = props.direction === 'row' ? 'row' : 'column';
  const gap = asNumber(props.gap, 10);
  const title = asString(props.title);

  return (
    <section style={shellStyle}>
      {title ? <h3 style={{ margin: 0, marginBottom: 10 }}>{title}</h3> : null}
      <p style={{ margin: 0, color: 'var(--texo-theme-muted, #6b7280)' }}>
        Layout: {direction} / gap {gap}
      </p>
    </section>
  );
}

export function TexoGrid(props: Record<string, unknown>): React.ReactElement {
  const columns = Math.max(1, Math.floor(asNumber(props.columns, 2)));
  const title = asString(props.title);
  return (
    <section style={shellStyle}>
      {title ? <h3 style={{ margin: 0, marginBottom: 8 }}>{title}</h3> : null}
      <div
        style={{
          display: 'grid',
          gap: 8,
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={`grid-cell-${index}`}
            style={{
              border: '1px dashed #cbd5e1',
              borderRadius: 'var(--texo-theme-radius, 8px)',
              minHeight: 48,
              padding: 8,
              color: 'var(--texo-theme-foreground, #0f172a)',
            }}
          >
            Cell {index + 1}
          </div>
        ))}
      </div>
    </section>
  );
}

export function TexoButton(props: Record<string, unknown>): React.ReactElement {
  const { dispatch } = useTexoContext();
  const label = asString(props.label, 'Action');
  const action = asString(props.action, 'action');
  const stylePreset =
    props.stylePreset === 'compact' ||
    props.stylePreset === 'wide' ||
    props.stylePreset === 'raised' ||
    props.stylePreset === 'pill' ||
    props.stylePreset === 'flat' ||
    props.stylePreset === 'outline-bold'
      ? props.stylePreset
      : undefined;
  const variant =
    props.variant === 'secondary' || props.variant === 'ghost' ? props.variant : 'primary';
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--texo-theme-accent, #111827)',
      color: 'var(--texo-theme-on-accent, #ffffff)',
      border: '1px solid var(--texo-theme-accent, #111827)',
    },
    secondary: {
      background: 'var(--texo-theme-background, #ffffff)',
      color: 'var(--texo-theme-foreground, #111827)',
      border: '1px solid var(--texo-theme-line, #111827)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--texo-theme-foreground, #111827)',
      border: '1px dashed var(--texo-theme-line, #9ca3af)',
    },
  };

  const presetStyles: Record<string, React.CSSProperties> = {
    compact: { padding: '6px 10px', fontSize: 13, minHeight: 36 },
    wide: { width: '100%', minHeight: 56, fontSize: 18, fontWeight: 700 },
    raised: {
      width: '100%',
      minHeight: 56,
      boxShadow: '0 10px 20px rgba(15, 23, 42, 0.15)',
      fontSize: 17,
      fontWeight: 700,
    },
    pill: { borderRadius: 999, padding: '10px 16px', fontWeight: 600 },
    flat: { boxShadow: 'none', minHeight: 48 },
    'outline-bold': { borderWidth: 2, fontWeight: 700, minHeight: 48 },
  };

  return (
    <button
      type="button"
      data-action={action}
      onClick={() => dispatch({ type: action, directive: 'texo-button', value: { label, action } })}
      style={{
        borderRadius: 'var(--texo-theme-radius, 10px)',
        padding: '8px 12px',
        width: '100%',
        minHeight: 48,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...styles[variant],
        ...(stylePreset ? presetStyles[stylePreset] : {}),
      }}
    >
      {label}
    </button>
  );
}

export function TexoInput(props: Record<string, unknown>): React.ReactElement {
  const label = asString(props.label, 'Field');
  const name = asString(props.name, 'field');
  const inputType =
    props.inputType === 'number' || props.inputType === 'email' || props.inputType === 'date'
      ? props.inputType
      : 'text';
  const placeholder = asString(props.placeholder);

  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 13, color: 'var(--texo-theme-foreground, #374151)' }}>{label}</span>
      <input
        name={name}
        type={inputType}
        placeholder={placeholder}
        style={{
          border: '1px solid var(--texo-theme-line, #d1d5db)',
          borderRadius: 'var(--texo-theme-radius, 8px)',
          padding: '8px 10px',
          background: 'var(--texo-theme-background, #ffffff)',
          color: 'var(--texo-theme-foreground, #0f172a)',
        }}
      />
    </label>
  );
}

export function TexoTable(props: Record<string, unknown>): React.ReactElement {
  const columns = asStringArray(props.columns);
  const rows = asRecordArray(props.rows);

  return (
    <div
      style={{
        overflowX: 'auto',
        color: 'var(--texo-theme-foreground, #0f172a)',
        background: 'var(--texo-theme-background, #ffffff)',
        borderRadius: 'var(--texo-theme-radius, 10px)',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                style={{
                  textAlign: 'left',
                  borderBottom: '1px solid var(--texo-theme-line, #d1d5db)',
                  padding: 8,
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`row-${index}`}>
              {columns.map((column) => (
                <td
                  key={`${index}-${column}`}
                  style={{ borderBottom: '1px solid var(--texo-theme-line, #e5e7eb)', padding: 8 }}
                >
                  {String(row[column] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TexoChart(props: Record<string, unknown>): React.ReactElement {
  const chartType =
    props.chartType === 'line' || props.chartType === 'pie' || props.chartType === 'donut'
      ? props.chartType
      : 'bar';
  const labels = asStringArray(props.labels);
  const firstSeries = Array.isArray(props.series) ? props.series[0] : undefined;
  const values =
    firstSeries &&
    typeof firstSeries === 'object' &&
    Array.isArray((firstSeries as { values?: unknown }).values)
      ? (firstSeries as { values: unknown[] }).values.filter(
          (value): value is number => typeof value === 'number' && Number.isFinite(value),
        )
      : [];
  const max = Math.max(...values, 1);
  const total = values.reduce((sum, value) => sum + value, 0);

  if (chartType === 'pie' || chartType === 'donut') {
    const palette = [
      'var(--texo-theme-accent, #2563eb)',
      '#0ea5e9',
      '#14b8a6',
      '#22c55e',
      '#f59e0b',
      '#ef4444',
    ];
    const gradientStops = values
      .map((value, index) => {
        const start = values.slice(0, index).reduce((sum, current) => sum + current, 0);
        const startPct = total > 0 ? Math.round((start / total) * 100) : 0;
        const endPct = total > 0 ? Math.round(((start + value) / total) * 100) : 0;
        const color = palette[index % palette.length];
        return `${color} ${startPct}% ${endPct}%`;
      })
      .join(', ');
    const ringMask =
      chartType === 'donut'
        ? 'radial-gradient(circle at center, transparent 43%, #000 44%)'
        : undefined;

    return (
      <section style={shellStyle}>
        <h3 style={{ margin: 0, marginBottom: 10 }}>Chart ({chartType})</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: gradientStops ? `conic-gradient(${gradientStops})` : '#e5e7eb',
              WebkitMaskImage: ringMask,
              maskImage: ringMask,
            }}
          />
          <div style={{ display: 'grid', gap: 6 }}>
            {labels.map((label, index) => {
              const value = values[index] ?? 0;
              const share = total > 0 ? Math.round((value / total) * 100) : 0;
              const color = palette[index % palette.length];
              return (
                <div
                  key={label}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: color,
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ flex: 1 }}>{label}</span>
                  <span>
                    {value} ({share}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (chartType === 'line') {
    const width = 260;
    const height = 120;
    const points = values
      .map((value, index) => {
        const x = labels.length > 1 ? (index / (labels.length - 1)) * width : width / 2;
        const y = height - (value / max) * (height - 10) - 5;
        return `${x},${Math.round(y)}`;
      })
      .join(' ');

    return (
      <section style={shellStyle}>
        <h3 style={{ margin: 0, marginBottom: 8 }}>Chart (line)</h3>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', maxWidth: 340 }}
          role="img"
          aria-label="Line chart"
        >
          <polyline
            fill="none"
            stroke="var(--texo-theme-accent, #2563eb)"
            strokeWidth="3"
            points={points}
          />
          {values.map((value, index) => {
            const x = labels.length > 1 ? (index / (labels.length - 1)) * width : width / 2;
            const y = height - (value / max) * (height - 10) - 5;
            return (
              <circle
                key={`${labels[index] ?? index}`}
                cx={x}
                cy={y}
                r="4"
                fill="var(--texo-theme-accent, #0ea5e9)"
              />
            );
          })}
        </svg>
        <div style={{ display: 'grid', gap: 4, marginTop: 6 }}>
          {labels.map((label, index) => (
            <div
              key={label}
              style={{ fontSize: 12, display: 'flex', justifyContent: 'space-between' }}
            >
              <span>{label}</span>
              <span>{values[index] ?? 0}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section style={shellStyle}>
      <h3 style={{ margin: 0, marginBottom: 8 }}>Chart ({chartType})</h3>
      <div style={{ display: 'grid', gap: 6 }}>
        {labels.map((label, index) => {
          const value = values[index] ?? 0;
          const width = `${Math.round((value / max) * 100)}%`;
          return (
            <div key={label} style={{ display: 'grid', gap: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>{label}</span>
                <span>{value}</span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 999,
                  background: 'var(--texo-theme-line, #e5e7eb)',
                }}
              >
                <div
                  style={{
                    height: 8,
                    borderRadius: 999,
                    background: 'var(--texo-theme-accent, #2563eb)',
                    width,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
