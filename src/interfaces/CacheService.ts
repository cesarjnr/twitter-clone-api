export type HashInput<T> = {
  [key in keyof T]: string | number;
}

export type HashValues<T> = {
  [key in keyof T]: string;
}

export interface CacheService {
  setHash<T>(key: string, data: HashInput<T>): Promise<void>;
  getHash<T extends object>(key: string): Promise<HashValues<T>>;
}
