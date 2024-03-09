type RecordKey = string | number | symbol;

function groupBy<T extends Record<RecordKey, unknown>, R extends RecordKey>(
  l: T[],
  f: (i: T) => R,
): Record<R, T[]> {
  let result: Record<R, T[]> = {} as Record<R, T[]>;

  l.forEach((v) => {
    const key = f(v);

    if (result[key]) {
      result[key].push(v);
    } else {
      result = { ...result, [key]: [v] };
    }
  });

  return result;
}
