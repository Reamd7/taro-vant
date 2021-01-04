import Taro from "@tarojs/taro";
const { useMemo, useState, useEffect, useCallback } = Taro /** api **/;
import { VanDialogProps } from ".";
import { getContext } from "../utils"

export function useDialogId() {
  return useMemo(() => "VanDialog" + Date.now().toString(), []);
}
const empty = {};
const map = new Map<string, {
  close: VoidFunction;
  show: (props: Partial<VanDialogProps>) => void;
}>();
export function useDialogOptions(id: string, setShow: (val: boolean) => void) {

  const [options, setOptions] = useState<Partial<VanDialogProps>>(empty)

  const context = getContext();

  const _id = context ? `${context}_${id}` : null;

  const close = useCallback(() => {
    setShow(false);
    setOptions(empty);
  }, []);

  useEffect(() => {
    // scope exist === attached 组件被挂载。
    if (_id && !map.has(_id)) {
      map.set(_id, {
        close: () => {
          close()
          queue.delete(close);
        },
        show: (props: Omit<Partial<VanDialogProps>, "show">) => {
          setOptions(props);
          setShow(true);
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
  }, [_id])

  return [options, close] as const;
}

const queue: Set<VoidFunction> = new Set();

const Dialog = (id: string, options: Omit<Partial<VanDialogProps>, "show">) => {
  const context = getContext();
  id = context ? `${context}_${id}` : '';
  if (id && map.has(id)) {
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
