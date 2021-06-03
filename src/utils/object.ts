export type ObjectWithoutNullishValues<T> = {
  [key in keyof T]: NonNullable<any>
}

export const removeNullishValues = <T>(object: T): ObjectWithoutNullishValues<T> => {
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