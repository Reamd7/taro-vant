import { CSSProperties } from "react";

export function CssProperties<T extends CSSProperties>(dict?: T | null | undefined) {
  if (!dict) return {} as T;
  return Object.keys(dict).reduce<T>((res, key) => {
    const value = dict[key]
    if (value != null) res[key] = value;
    return res;
  }, {} as T)
}
