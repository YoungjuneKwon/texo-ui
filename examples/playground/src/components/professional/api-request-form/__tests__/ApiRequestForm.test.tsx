import { describe, expect, it } from 'vitest';
import { ApiRequestForm } from '../ApiRequestForm';

describe('ApiRequestForm', () => {
  it('exports component', () => {
    expect(ApiRequestForm).toBeTypeOf('function');
  });
});
