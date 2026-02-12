import { describe, expect, it } from 'vitest';
import { SettlementCalculator } from '../SettlementCalculator';

describe('SettlementCalculator', () => {
  it('exports component', () => {
    expect(SettlementCalculator).toBeTypeOf('function');
  });
});
