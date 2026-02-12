import { describe, expect, it } from 'vitest';
import type { StorageDriver } from '../src/types';

export function runDriverConformanceTests(createDriver: () => StorageDriver): void {
  describe('driver conformance', () => {
    it('implements CRUD lifecycle', async () => {
      const driver = createDriver();
      await driver.initialize();

      const created = await driver.create('notes', { title: 'hello', count: 1 });
      expect(created.id).toBeTruthy();

      const read = await driver.read<{ title: string }>('notes', created.id);
      expect(read?.data.title).toBe('hello');

      const updated = await driver.update<{ title: string; count: number }>('notes', created.id, {
        title: 'updated',
      });
      expect(updated.data.title).toBe('updated');

      const listed = await driver.list('notes');
      expect(listed.length).toBeGreaterThan(0);

      const deleted = await driver.delete('notes', created.id);
      expect(deleted).toBe(true);
    });

    it('drops a collection', async () => {
      const driver = createDriver();
      await driver.initialize();
      await driver.create('to-drop', { ok: true });
      await driver.dropCollection('to-drop');
      const items = await driver.list('to-drop');
      expect(items).toHaveLength(0);
    });
  });
}
