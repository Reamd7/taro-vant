export * from "./nextTick";
export * from "./requestAnimationFrame"
export * from "./useScopeRef"
export * from "./addUnit";
export * from "./BehaviorSubject";
export * from "./bem";
export * from "./constant";
export * from "./createSelectorQuery";
export * from "./CssProperties";
export * from "./ExtClass";
export * from "./getAllRect";
export * from "./getContext";
export * from "./getCurrentPage";
export * from "./getRect";
export * from "./GroupContextCreator";
export * from "./relation";

import classNames from 'classNames';
export function useMemoClassNames() {
  return classNames
}

export function range(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}
export type ActiveProps<P, K extends keyof P> = Omit<P, K> & Required<Pick<P, K>> & {
  children?: React.ReactNode
};

