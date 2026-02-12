export interface Serializer {
  serialize<T>(value: T): string;
  deserialize<T>(value: string): T;
}

export const jsonSerializer: Serializer = {
  serialize<T>(value: T): string {
    return JSON.stringify(value);
  },
  deserialize<T>(value: string): T {
    return JSON.parse(value) as T;
  },
};
