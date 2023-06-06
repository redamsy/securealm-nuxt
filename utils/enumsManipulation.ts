export function enumToKeyValuePairs<T extends Record<keyof T, T[keyof T]>>(enumObject: T): Array<{ key: keyof T; value: T[keyof T] }> {
  return Object.entries(enumObject).map(([key, value]) => ({ key: key as keyof T, value: value as T[keyof T] }));
}