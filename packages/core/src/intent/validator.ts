import type { IntentPlan } from './types';

export interface IntentPlanValidationResult {
  ok: boolean;
  errors: string[];
  value?: IntentPlan;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function hasBaseShape(node: Record<string, unknown>): node is Record<string, unknown> & {
  id: string;
  type: string;
} {
  return typeof node.id === 'string' && typeof node.type === 'string';
}

function validateChildren(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) {
    return [`${path}.children must be an array`];
  }
  const errors: string[] = [];
  value.forEach((child, index) => {
    errors.push(...validateNode(child, `${path}.children[${index}]`));
  });
  return errors;
}

function validateNode(node: unknown, path: string): string[] {
  if (!isRecord(node) || !hasBaseShape(node)) {
    return [`${path} must be an object with string id/type`];
  }

  switch (node.type) {
    case 'screen': {
      return validateChildren(node.children, path);
    }
    case 'stack': {
      const errors = validateChildren(node.children, path);
      if (node.gap !== undefined && typeof node.gap !== 'number') {
        errors.push(`${path}.gap must be number`);
      }
      if (node.direction !== undefined && node.direction !== 'row' && node.direction !== 'column') {
        errors.push(`${path}.direction must be row|column`);
      }
      return errors;
    }
    case 'grid': {
      const errors = validateChildren(node.children, path);
      if (typeof node.columns !== 'number' || !Number.isFinite(node.columns) || node.columns < 1) {
        errors.push(`${path}.columns must be a positive number`);
      }
      return errors;
    }
    case 'card': {
      return validateChildren(node.children, path);
    }
    case 'text': {
      return typeof node.content === 'string' ? [] : [`${path}.content must be string`];
    }
    case 'button': {
      const errors: string[] = [];
      if (typeof node.label !== 'string') {
        errors.push(`${path}.label must be string`);
      }
      if (typeof node.action !== 'string') {
        errors.push(`${path}.action must be string`);
      }
      return errors;
    }
    case 'input': {
      const errors: string[] = [];
      if (typeof node.name !== 'string') {
        errors.push(`${path}.name must be string`);
      }
      if (typeof node.label !== 'string') {
        errors.push(`${path}.label must be string`);
      }
      return errors;
    }
    case 'select': {
      const errors: string[] = [];
      if (typeof node.name !== 'string') {
        errors.push(`${path}.name must be string`);
      }
      if (typeof node.label !== 'string') {
        errors.push(`${path}.label must be string`);
      }
      if (
        !Array.isArray(node.options) ||
        node.options.some(
          (option) =>
            !isRecord(option) ||
            typeof option.label !== 'string' ||
            typeof option.value !== 'string',
        )
      ) {
        errors.push(`${path}.options must be array of {label,value}`);
      }
      return errors;
    }
    case 'table': {
      const errors: string[] = [];
      if (!isStringArray(node.columns)) {
        errors.push(`${path}.columns must be string[]`);
      }
      if (!Array.isArray(node.rows) || node.rows.some((row) => !isRecord(row))) {
        errors.push(`${path}.rows must be object[]`);
      }
      return errors;
    }
    case 'chart': {
      const errors: string[] = [];
      if (!isStringArray(node.labels)) {
        errors.push(`${path}.labels must be string[]`);
      }
      if (
        !Array.isArray(node.series) ||
        node.series.some(
          (series) =>
            !isRecord(series) ||
            typeof series.name !== 'string' ||
            !Array.isArray(series.values) ||
            series.values.some((value) => typeof value !== 'number'),
        )
      ) {
        errors.push(`${path}.series must be array of {name,values:number[]}`);
      }
      return errors;
    }
    default:
      return [`${path}.type is unsupported`];
  }
}

export function validateIntentPlan(input: unknown): IntentPlanValidationResult {
  if (!isRecord(input)) {
    return { ok: false, errors: ['intent plan must be an object'] };
  }

  const errors: string[] = [];

  if (input.version !== '1.0') {
    errors.push('version must be 1.0');
  }

  const root = input.root;
  if (!isRecord(root) || root.type !== 'screen') {
    errors.push('root must be a screen node');
  } else {
    errors.push(...validateNode(root, 'root'));
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    errors: [],
    value: input as unknown as IntentPlan,
  };
}
