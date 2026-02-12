import { describe, expect, it } from 'vitest';
import { DataAdapter, LocalStorageDriver } from '../src';

class MockStorage {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
}

describe('DataAdapter', () => {
  it('activates and proxies to local-storage driver', async () => {
    const adapter = new DataAdapter();
    adapter.registerDriver(
      new LocalStorageDriver({ storage: new MockStorage() as unknown as Storage }),
    );
    await adapter.use('local-storage');
    const item = await adapter.create('todos', { text: 'hello' });
    const read = await adapter.read<{ text: string }>('todos', item.id);
    expect(read?.data.text).toBe('hello');
  });

  it('throws when no active driver is selected', async () => {
    const adapter = new DataAdapter();
    expect(() => adapter.getActiveDriver()).toThrow('No active storage driver');
  });
});
