/* eslint-disable */
export function addUnit(value?: string | number | null) {
  if (value == null) {
    return undefined;
  } else if (typeof value === "number") {
    return value + "px"
  } else {
    return value
  }
}