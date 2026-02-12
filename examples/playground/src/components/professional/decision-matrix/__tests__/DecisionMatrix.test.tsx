import { describe, expect, it } from 'vitest';
import { DecisionMatrix } from '../DecisionMatrix';

describe('DecisionMatrix', () => {
  it('exports component', () => {
    expect(DecisionMatrix).toBeTypeOf('function');
  });
});
