import { describe, expect, it } from 'vitest';
import { LocalStorageDriver } from '../src';
import { runDriverConformanceTests } from './conformance';

class MockStorage {
  private map = new Map<string, string>();
  constructor(private readonly maxSize = Number.POSITIVE_INFINITY) {}

  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    if (value.length > this.maxSize) {
      throw new Error('QuotaExceededError');
    }
    this.map.set(key, value);
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }
}

runDriverConformanceTests(
  () =>
    new LocalStorageDriver({ storage: new MockStorage() as unknown as Storage, prefix: 'test_' }),
);

describe('LocalStorageDriver', () => {
  it('supports filter, sort and pagination', async () => {
    const driver = new LocalStorageDriver({ storage: new MockStorage() as unknown as Storage });
    await driver.create('users', { name: 'c', age: 30 });
    await driver.create('users', { name: 'a', age: 10 });
    await driver.create('users', { name: 'b', age: 20 });

    const filtered = await driver.list<{ name: string; age: number }>('users', {
      filter: { age: 20 },
    });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].data.name).toBe('b');

    const sorted = await driver.list<{ name: string; age: number }>('users', {
      sort: { field: 'age', order: 'asc' },
    });
    expect(sorted.map((v) => v.data.name)).toEqual(['a', 'b', 'c']);

    const paged = await driver.list<{ name: string }>('users', {
      sort: { field: 'name', order: 'asc' },
      offset: 1,
      limit: 1,
    });
    expect(paged).toHaveLength(1);
    expect(paged[0].data.name).toBe('b');
  });

  it('applies prefix correctly', async () => {
    const storage = new MockStorage();
    const driver = new LocalStorageDriver({
      storage: storage as unknown as Storage,
      prefix: 'abc_',
    });
    await driver.create('items', { x: 1 });
    expect(storage.getItem('abc_items')).not.toBeNull();
  });

  it('throws quota error when exceeding storage', async () => {
    const driver = new LocalStorageDriver({
      storage: new MockStorage(10) as unknown as Storage,
      prefix: 'quota_',
    });
    await expect(driver.create('items', { text: 'this payload is very large' })).rejects.toThrow(
      'quota',
    );
  });

  it('handles concurrent writes on same collection', async () => {
    const driver = new LocalStorageDriver({ storage: new MockStorage() as unknown as Storage });
    await Promise.all(
      Array.from({ length: 10 }, (_, i) => driver.create('concurrency', { value: i })),
    );
    const all = await driver.list('concurrency');
    expect(all.length).toBe(10);
  });
});
