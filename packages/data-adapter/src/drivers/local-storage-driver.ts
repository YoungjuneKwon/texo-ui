import { StorageError, StorageErrorCode } from '../errors';
import type { ListOptions, StorageDriver, StorageItem } from '../types';
import { generateId } from '../utils/id-generator';
import { jsonSerializer, type Serializer } from '../utils/serializer';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class MemoryStorage implements StorageLike {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }

  size(): number {
    let total = 0;
    for (const value of this.store.values()) {
      total += value.length;
    }
    return total;
  }
}

export interface LocalStorageDriverOptions {
  prefix?: string;
  serializer?: Serializer;
  quotaWarning?: number;
  storage?: StorageLike;
}

function byPath(value: unknown, field: string): unknown {
  if (!field.includes('.')) {
    return (value as Record<string, unknown> | undefined)?.[field];
  }
  return field.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, value);
}

export class LocalStorageDriver implements StorageDriver {
  readonly name = 'local-storage';
  private readonly prefix: string;
  private readonly serializer: Serializer;
  private readonly quotaWarning: number;
  private readonly storage: StorageLike;

  constructor(options?: LocalStorageDriverOptions) {
    this.prefix = options?.prefix ?? 'texo_';
    this.serializer = options?.serializer ?? jsonSerializer;
    this.quotaWarning = options?.quotaWarning ?? 4 * 1024 * 1024;
    this.storage =
      options?.storage ?? (globalThis.localStorage ? globalThis.localStorage : new MemoryStorage());
  }

  async initialize(): Promise<void> {
    return;
  }

  async create<T>(collection: string, data: T): Promise<StorageItem<T>> {
    const now = new Date().toISOString();
    const item: StorageItem<T> = {
      id: generateId(),
      data,
      createdAt: now,
      updatedAt: now,
    };
    const items = this.readCollection<T>(collection);
    items.push(item);
    this.writeCollection(collection, items);
    return item;
  }

  async read<T>(collection: string, id: string): Promise<StorageItem<T> | null> {
    const items = this.readCollection<T>(collection);
    return items.find((item) => item.id === id) ?? null;
  }

  async list<T>(collection: string, options?: ListOptions): Promise<StorageItem<T>[]> {
    let items = this.readCollection<T>(collection);

    if (options?.filter) {
      items = items.filter((item) =>
        Object.entries(options.filter ?? {}).every(
          ([key, value]) => byPath(item.data, key) === value,
        ),
      );
    }

    if (options?.sort) {
      const { field, order } = options.sort;
      items = [...items].sort((a, b) => {
        const av = byPath(a.data, field);
        const bv = byPath(b.data, field);
        if (av === bv) {
          return 0;
        }
        if (av === undefined || av === null) {
          return order === 'asc' ? -1 : 1;
        }
        if (bv === undefined || bv === null) {
          return order === 'asc' ? 1 : -1;
        }
        return (av as string | number) > (bv as string | number)
          ? order === 'asc'
            ? 1
            : -1
          : order === 'asc'
            ? -1
            : 1;
      });
    }

    const offset = options?.offset ?? 0;
    const limit = options?.limit ?? items.length;
    return items.slice(offset, offset + limit);
  }

  async update<T>(collection: string, id: string, data: Partial<T>): Promise<StorageItem<T>> {
    const items = this.readCollection<T>(collection);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new StorageError(`Item '${id}' not found.`, StorageErrorCode.NOT_FOUND, this.name);
    }

    const current = items[index];
    const next: StorageItem<T> = {
      ...current,
      data: {
        ...(current.data as Record<string, unknown>),
        ...(data as Record<string, unknown>),
      } as T,
      updatedAt: new Date().toISOString(),
    };
    items[index] = next;
    this.writeCollection(collection, items);
    return next;
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const items = this.readCollection(collection);
    const next = items.filter((item) => item.id !== id);
    if (next.length === items.length) {
      return false;
    }
    this.writeCollection(collection, next);
    return true;
  }

  async dropCollection(collection: string): Promise<void> {
    this.storage.removeItem(this.collectionKey(collection));
  }

  async dispose(): Promise<void> {
    return;
  }

  getUsage(): { used: number; quota: number; percentage: number } {
    let used = 0;
    if (this.storage instanceof MemoryStorage) {
      used = this.storage.size();
    }
    const quota = this.quotaWarning;
    return {
      used,
      quota,
      percentage: quota === 0 ? 0 : (used / quota) * 100,
    };
  }

  private collectionKey(collection: string): string {
    return `${this.prefix}${collection}`;
  }

  private readCollection<T>(collection: string): StorageItem<T>[] {
    const raw = this.storage.getItem(this.collectionKey(collection));
    if (!raw) {
      return [];
    }
    return this.serializer.deserialize<StorageItem<T>[]>(raw);
  }

  private writeCollection<T>(collection: string, items: StorageItem<T>[]): void {
    const payload = this.serializer.serialize(items);
    try {
      this.storage.setItem(this.collectionKey(collection), payload);
    } catch (error) {
      throw new StorageError(
        'LocalStorage quota exceeded while writing collection.',
        StorageErrorCode.QUOTA_EXCEEDED,
        this.name,
        error instanceof Error ? error : undefined,
      );
    }

    if (payload.length > this.quotaWarning) {
      throw new StorageError(
        `LocalStorage payload exceeded warning threshold (${this.quotaWarning} bytes).`,
        StorageErrorCode.QUOTA_EXCEEDED,
        this.name,
      );
    }
  }
}
