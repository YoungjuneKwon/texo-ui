import type { IntentNode, IntentPlan } from '@texo-ui/core';

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function normalizeType(rawType: unknown): string {
  const type = asString(rawType) ?? 'text';
  return type.startsWith('texo-') ? type.slice(5) : type;
}

function normalizeDirection(value: unknown): 'row' | 'column' | undefined {
  if (value === 'row' || value === 'horizontal') {
    return 'row';
  }
  if (value === 'column' || value === 'vertical') {
    return 'column';
  }
  return undefined;
}

function normalizeGap(value: unknown): number | undefined {
  if (value === 'small') {
    return 8;
  }
  if (value === 'medium') {
    return 12;
  }
  if (value === 'large') {
    return 16;
  }
  return asNumber(value);
}

function normalizeChartSeries(value: unknown): Array<{ name: string; values: number[] }> {
  if (!Array.isArray(value)) {
    return [];
  }

  if (value.every((entry) => Array.isArray(entry))) {
    return value.map((row, index) => ({
      name: `Series ${index + 1}`,
      values: (row as unknown[]).map((v) => asNumber(v) ?? 0),
    }));
  }

  return value
    .filter((entry): entry is AnyRecord => isRecord(entry))
    .map((entry, index) => ({
      name: asString(entry.name) ?? `Series ${index + 1}`,
      values: Array.isArray(entry.values)
        ? entry.values.map((v) => asNumber(v) ?? 0)
        : Array.isArray(entry.data)
          ? entry.data.map((v) => asNumber(v) ?? 0)
          : [],
    }));
}

function normalizeTableColumns(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => {
      if (typeof entry === 'string') {
        return entry;
      }
      if (isRecord(entry)) {
        return asString(entry.key) ?? asString(entry.header) ?? asString(entry.name) ?? '';
      }
      return '';
    })
    .filter((entry) => entry.length > 0);
}

function normalizeTableRows(
  value: unknown,
): Array<Record<string, string | number | boolean | null>> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is AnyRecord => isRecord(entry))
    .map((entry) => {
      const row: Record<string, string | number | boolean | null> = {};
      for (const [key, raw] of Object.entries(entry)) {
        if (
          typeof raw === 'string' ||
          typeof raw === 'number' ||
          typeof raw === 'boolean' ||
          raw === null
        ) {
          row[key] = raw;
          continue;
        }
        row[key] = raw === undefined ? null : String(raw);
      }
      return row;
    });
}

function normalizeNode(raw: unknown, nextId: () => string): IntentNode | null {
  if (!isRecord(raw)) {
    return null;
  }

  const type = normalizeType(raw.type);
  const id = asString(raw.id) ?? nextId();

  if (type === 'screen' || type === 'stack' || type === 'grid' || type === 'card') {
    const childrenRaw = Array.isArray(raw.children) ? raw.children : [];
    const children = childrenRaw
      .map((child) => normalizeNode(child, nextId))
      .filter((child): child is IntentNode => child !== null);

    if (type === 'screen') {
      return { id, type: 'screen', title: asString(raw.title), children };
    }
    if (type === 'stack') {
      return {
        id,
        type: 'stack',
        title: asString(raw.title),
        direction: normalizeDirection(raw.direction),
        gap: normalizeGap(raw.gap),
        children,
      };
    }
    if (type === 'grid') {
      return {
        id,
        type: 'grid',
        title: asString(raw.title),
        columns: Math.max(1, Math.floor(asNumber(raw.columns) ?? 2)),
        children,
      };
    }
    return { id, type: 'card', title: asString(raw.title), children };
  }

  if (type === 'text') {
    return {
      id,
      type: 'text',
      title: asString(raw.title),
      content: asString(raw.content) ?? asString(raw.text) ?? '',
    };
  }

  if (type === 'button') {
    const label = asString(raw.label) ?? asString(raw.text) ?? 'Action';
    return {
      id,
      type: 'button',
      label,
      action: asString(raw.action) ?? label.toLowerCase().replace(/\s+/g, '-'),
      variant:
        raw.variant === 'primary' || raw.variant === 'secondary' || raw.variant === 'ghost'
          ? raw.variant
          : undefined,
    };
  }

  if (type === 'input') {
    return {
      id,
      type: 'input',
      label: asString(raw.label) ?? 'Field',
      name: asString(raw.name) ?? 'field',
      inputType:
        raw.inputType === 'text' ||
        raw.inputType === 'number' ||
        raw.inputType === 'email' ||
        raw.inputType === 'date'
          ? raw.inputType
          : undefined,
      placeholder: asString(raw.placeholder),
    };
  }

  if (type === 'select') {
    return {
      id,
      type: 'select',
      label: asString(raw.label) ?? 'Select',
      name: asString(raw.name) ?? 'select',
      options: Array.isArray(raw.options)
        ? raw.options
            .filter((entry): entry is AnyRecord => isRecord(entry))
            .map((entry) => ({
              label: asString(entry.label) ?? asString(entry.value) ?? 'Option',
              value: asString(entry.value) ?? asString(entry.label) ?? 'option',
            }))
        : [],
    };
  }

  if (type === 'table') {
    const columns = normalizeTableColumns(raw.columns);
    const rows = normalizeTableRows(raw.rows);
    return {
      id,
      type: 'table',
      columns,
      rows,
    };
  }

  if (type === 'chart') {
    const chartType =
      raw.chartType === 'bar' ||
      raw.chartType === 'line' ||
      raw.chartType === 'pie' ||
      raw.chartType === 'donut'
        ? raw.chartType
        : 'bar';
    return {
      id,
      type: 'chart',
      chartType,
      labels: Array.isArray(raw.labels)
        ? raw.labels.map((label) => asString(label) ?? '').filter((label) => label.length > 0)
        : [],
      series: normalizeChartSeries(raw.series),
    };
  }

  return null;
}

export function normalizeIntentPlan(input: unknown): IntentPlan {
  let idCounter = 1;
  const nextId = (): string => `node-${idCounter++}`;

  const planRecord = isRecord(input) ? input : {};
  const rootCandidate = isRecord(planRecord.root) ? planRecord.root : {};

  const rootNode = normalizeNode({ type: 'screen', ...rootCandidate }, nextId);
  const root =
    rootNode && rootNode.type === 'screen'
      ? rootNode
      : {
          id: nextId(),
          type: 'screen' as const,
          children: [],
        };

  return {
    version: '1.0',
    meta: isRecord(planRecord.meta)
      ? {
          prompt: asString(planRecord.meta.prompt),
          locale: asString(planRecord.meta.locale),
          generatedAt: asString(planRecord.meta.generatedAt),
        }
      : undefined,
    root,
  };
}
