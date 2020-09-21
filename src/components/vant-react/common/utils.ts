/* eslint-disable */
export function addUnit(value?: string | number | null) {
  if (value == null) {
    return undefined;
  } else if (typeof value === "number") {
    return value + "rpx"
  } else {
    return value
  }
}

export function CssProperties<T extends Record<string, null | undefined | string | number>>(dict: T) {
  return Object.keys(dict).reduce<T>((res, key: keyof T) => {
    const value = dict[key]
    if (value != null) res[key] = value;
    return res;
  }, { } as T)
}