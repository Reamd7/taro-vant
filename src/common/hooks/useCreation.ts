import { useState } from 'react';
import useUpdateEffect from './useUpdateEffect';

export type noop = (...args: any[]) => any;

export default function useCreation<T>(factory: () => T, deps: any[]): T {

  const [state, setState] = useState(factory);
  useUpdateEffect(() => {
    setState(factory())
  }, deps);
  return state
};
