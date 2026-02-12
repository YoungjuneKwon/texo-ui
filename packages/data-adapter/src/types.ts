export interface StorageItem<T = unknown> {
  id: string;
  data: T;
  createdAt: string;
  updatedAt: string;
  meta?: Record<string, unknown>;
}

export interface ListOptions {
  filter?: Record<string, unknown>;
  sort?: { field: string; order: 'asc' | 'desc' };
  limit?: number;
  offset?: number;
}

export interface StorageDriver {
  readonly name: string;
  initialize(): Promise<void>;
  create<T>(collection: string, data: T): Promise<StorageItem<T>>;
  read<T>(collection: string, id: string): Promise<StorageItem<T> | null>;
  list<T>(collection: string, options?: ListOptions): Promise<StorageItem<T>[]>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<StorageItem<T>>;
  delete(collection: string, id: string): Promise<boolean>;
  dropCollection(collection: string): Promise<void>;
  dispose(): Promise<void>;
}
