import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DataAdapter } from '../data-adapter';
import type { StorageItem } from '../types';

export function useTexoData<T>(
  collection: string,
  adapter: DataAdapter,
): {
  items: StorageItem<T>[];
  loading: boolean;
  error: Error | null;
  create: (data: T) => Promise<void>;
  update: (id: string, data: Partial<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
} {
  const [items, setItems] = useState<StorageItem<T>[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const next = await adapter.list<T>(collection);
      setItems(next);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load collection.'));
    } finally {
      setLoading(false);
    }
  }, [adapter, collection]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const create = useCallback(
    async (data: T): Promise<void> => {
      await adapter.create(collection, data);
      await refresh();
    },
    [adapter, collection, refresh],
  );

  const update = useCallback(
    async (id: string, data: Partial<T>): Promise<void> => {
      await adapter.update(collection, id, data);
      await refresh();
    },
    [adapter, collection, refresh],
  );

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await adapter.delete(collection, id);
      await refresh();
    },
    [adapter, collection, refresh],
  );

  return useMemo(
    () => ({ items, loading, error, create, update, remove, refresh }),
    [items, loading, error, create, update, remove, refresh],
  );
}
