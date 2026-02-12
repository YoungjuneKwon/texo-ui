import type { ListOptions, StorageDriver, StorageItem } from './types';

export class DataAdapter {
  private drivers = new Map<string, StorageDriver>();
  private activeDriver: StorageDriver | null = null;

  registerDriver(driver: StorageDriver): void {
    this.drivers.set(driver.name, driver);
  }

  async use(driverName: string): Promise<void> {
    const driver = this.drivers.get(driverName);
    if (!driver) {
      throw new Error(`Driver '${driverName}' is not registered.`);
    }
    await driver.initialize();
    this.activeDriver = driver;
  }

  getActiveDriver(): StorageDriver {
    if (!this.activeDriver) {
      throw new Error('No active storage driver selected.');
    }
    return this.activeDriver;
  }

  create<T>(collection: string, data: T): Promise<StorageItem<T>> {
    return this.getActiveDriver().create(collection, data);
  }

  read<T>(collection: string, id: string): Promise<StorageItem<T> | null> {
    return this.getActiveDriver().read(collection, id);
  }

  list<T>(collection: string, options?: ListOptions): Promise<StorageItem<T>[]> {
    return this.getActiveDriver().list(collection, options);
  }

  update<T>(collection: string, id: string, data: Partial<T>): Promise<StorageItem<T>> {
    return this.getActiveDriver().update(collection, id, data);
  }

  delete(collection: string, id: string): Promise<boolean> {
    return this.getActiveDriver().delete(collection, id);
  }

  dropCollection(collection: string): Promise<void> {
    return this.getActiveDriver().dropCollection(collection);
  }

  async dispose(): Promise<void> {
    const all = Array.from(this.drivers.values());
    await Promise.all(all.map((driver) => driver.dispose()));
    this.activeDriver = null;
    this.drivers.clear();
  }
}
