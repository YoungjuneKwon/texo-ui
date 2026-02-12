import type { RecoveryEventType } from './recovery-manager';

export const RECOVERY_MESSAGES: Record<RecoveryEventType, string> = {
  'yaml-parse-error': 'YAML parsing failed. Falling back to last valid attributes.',
  'unclosed-directive': 'Directive was not closed. Auto-closing at stream end.',
  'buffer-overflow': 'Parser buffer exceeded limit. Forcing partial flush.',
  'unclosed-inline': 'Inline markup appears unclosed. Falling back to plain text.',
  'invalid-directive-name': 'Directive name is invalid. Falling back to text behavior.',
  'invalid-input': 'Invalid chunk input. Ignoring malformed value.',
};
