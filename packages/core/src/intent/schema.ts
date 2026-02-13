import type { IntentNodeType } from './types';

const intentNodeTypes: IntentNodeType[] = [
  'screen',
  'stack',
  'grid',
  'card',
  'text',
  'button',
  'input',
  'select',
  'table',
  'chart',
];

export const INTENT_PLAN_JSON_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://texo-ui.dev/schema/intent-plan/v1.json',
  title: 'Texo Intent Plan v1',
  type: 'object',
  additionalProperties: false,
  required: ['version', 'root'],
  properties: {
    version: {
      const: '1.0',
    },
    meta: {
      type: 'object',
      additionalProperties: false,
      properties: {
        prompt: { type: 'string' },
        locale: { type: 'string' },
        generatedAt: { type: 'string' },
      },
    },
    root: {
      type: 'object',
      additionalProperties: true,
      required: ['type', 'id', 'children'],
      properties: {
        type: { const: 'screen' },
        id: { type: 'string' },
        children: {
          type: 'array',
          items: {
            type: 'object',
            required: ['type', 'id'],
            properties: {
              id: { type: 'string' },
              type: { enum: intentNodeTypes },
            },
          },
        },
      },
    },
  },
} as const;
