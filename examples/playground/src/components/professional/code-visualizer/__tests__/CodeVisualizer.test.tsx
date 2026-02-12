import { describe, expect, it } from 'vitest';
import { CodeVisualizer } from '../CodeVisualizer';

describe('CodeVisualizer', () => {
  it('exports component', () => {
    expect(CodeVisualizer).toBeTypeOf('function');
  });
});
