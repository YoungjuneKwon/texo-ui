export type IntentNodeType =
  | 'screen'
  | 'stack'
  | 'grid'
  | 'card'
  | 'text'
  | 'button'
  | 'input'
  | 'select'
  | 'table'
  | 'chart';

export interface IntentNodeBase {
  id: string;
  type: IntentNodeType;
  title?: string;
  description?: string;
}

export interface IntentScreenNode extends IntentNodeBase {
  type: 'screen';
  children: IntentNode[];
}

export interface IntentStackNode extends IntentNodeBase {
  type: 'stack';
  direction?: 'row' | 'column';
  gap?: number;
  children: IntentNode[];
}

export interface IntentGridNode extends IntentNodeBase {
  type: 'grid';
  columns: number;
  children: IntentNode[];
}

export interface IntentCardNode extends IntentNodeBase {
  type: 'card';
  children: IntentNode[];
}

export interface IntentTextNode extends IntentNodeBase {
  type: 'text';
  content: string;
  tone?: 'default' | 'muted' | 'positive' | 'negative';
}

export interface IntentButtonNode extends IntentNodeBase {
  type: 'button';
  label: string;
  action: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface IntentInputNode extends IntentNodeBase {
  type: 'input';
  name: string;
  label: string;
  inputType?: 'text' | 'number' | 'email' | 'date';
  placeholder?: string;
}

export interface IntentSelectNode extends IntentNodeBase {
  type: 'select';
  name: string;
  label: string;
  options: Array<{ label: string; value: string }>;
}

export interface IntentTableNode extends IntentNodeBase {
  type: 'table';
  columns: string[];
  rows: Array<Record<string, string | number | boolean | null>>;
}

export interface IntentChartNode extends IntentNodeBase {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'donut';
  labels: string[];
  series: Array<{ name: string; values: number[] }>;
}

export type IntentNode =
  | IntentScreenNode
  | IntentStackNode
  | IntentGridNode
  | IntentCardNode
  | IntentTextNode
  | IntentButtonNode
  | IntentInputNode
  | IntentSelectNode
  | IntentTableNode
  | IntentChartNode;

export interface IntentPlanMeta {
  prompt?: string;
  locale?: string;
  generatedAt?: string;
}

export interface IntentPlan {
  version: '1.0';
  meta?: IntentPlanMeta;
  root: IntentScreenNode;
}
