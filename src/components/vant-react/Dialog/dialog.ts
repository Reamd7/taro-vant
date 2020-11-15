import { useMemo, useState, useEffect, useScope, useCallback } from "@tarojs/taro";
import { VanDialogProps } from ".";
import { getContext } from "../common/utils";

export function useDialogId() {
  return useMemo(() => "VanDialog" + Date.now().toString(), []);
}
const empty = {};
const showFalses = {
  show: false
}
const map = new Map<string, {
  close: VoidFunction;
  show: (props: Partial<VanDialogProps>) => void;
}>();
export function useDialogOptions(id: string) {

  const [options, setOptions] = useState<Partial<VanDialogProps>>(empty)

  const context = getContext();

  const scope = useScope();

  const _id = context ? `${context}_${id}` : null;

  const close = useCallback(() => {
    setOptions(showFalses)
  }, []);

  useEffect(() => {
    // scope exist === attached 组件被挂载。
    if (scope && _id && !map.has(_id)) {
      map.set(_id, {
        close: () => {
          close()
          queue.delete(close);
        },
        show: (props: Partial<VanDialogProps>) => {
          setOptions(props);
          queue.add(close);
        }
      })
    }

    return function () {
      if (_id && map.has(_id)) {
        map.delete(_id)
      }
      queue.delete(close)
    }
  }, [_id, scope])

  return options;
}

const queue: Set<VoidFunction> = new Set();

const Dialog = (id: string, options: Partial<VanDialogProps>) => {
  if (map.has(id)) {
    const el = map.get(id);
    if (el) {
      el.show(options);
      return el.close
    }
  }
  return null
}

Dialog.confirm = (id: string, options: Partial<VanDialogProps>) => {
  return Dialog(id, {
    ...options,
    showCancelButton: true
  })
}

Dialog.close = (id?: string) => {
  if (id) {
    if (map.has(id)) {
      const el = map.get(id);
      if (el) {
        el.close()
      }
    }
  } else {
    queue.forEach(close => close());
    queue.clear();
  }
}

export default Dialog
