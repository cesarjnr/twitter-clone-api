export type ObjectWithoutNullishValues<T> = {
  [key in keyof T]: NonNullable<any>
}

export const removeNullishValues = <T extends object>(object: T): ObjectWithoutNullishValues<T> => {
  if (Array.isArray(object) || typeof object === 'function') {
    throw new Error('Parameter must be an object');
  }

  const newObj = {} as ObjectWithoutNullishValues<T>;
  const objectKeyValuePairs = Object.entries(object);

  for (const [key, value] of objectKeyValuePairs) {
    if (!!value) {
      const typedKey = key as keyof ObjectWithoutNullishValues<T>;

      newObj[typedKey] = value;
    }
  }

  return newObj;
}