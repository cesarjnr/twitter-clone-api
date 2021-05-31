export type HashData<T> ={
  [key in keyof T]: string | number;
}

export interface CacheService {
  setHashMap<T>(key: string, data: HashData<T>): Promise<void>;
}
