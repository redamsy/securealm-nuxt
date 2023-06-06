export function objectToArray(
  object: Record<string, string>,
  keyName: string,
  valueName: string
) {
  const array: any = [];
  Object.entries(object).forEach(([key], index) => {
    array.push({
      [keyName]: key,
      [valueName]: object[key],
    });
  });
  return array;
}
