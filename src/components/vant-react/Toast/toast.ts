import Taro, { useMemo } from "@tarojs/taro";
import { getContext, noop } from "../common/utils";
import type { VanToastProps } from ".";
export const VanToastMap = new Map<
  VanToastProps["gid"] | ReturnType<typeof getContext>,
  {
    setData: (_data: Omit<VanToastProps, "id">) => void;
    activeToastIns: Taro.MutableRefObject<(() => void) | undefined>;
  }
>();
const defaultOptions: Required<Omit<VanToastProps, "gid"> & {
  onClose?: VoidFunction;
  duration?: number;
}> = {
  type: "text",
  mask: false,
  message: "",
  show: true,
  zIndex: 1000,
  position: "middle",
  forbidClick: false,
  loadingType: "circular",
  onClose: noop,
  duration: 2000
};
const ToastClearQueue = new Set<VoidFunction>();

export const Toast = (
  options:
    | NonNullable<VanToastProps["message"]>
    | (VanToastProps & {
      onClose?: VoidFunction;
      duration?: number;
    })
) => {
  let data: Required<VanToastProps & {
    onClose?: VoidFunction;
    duration?: number;
  }>;
  if (typeof options !== "object") {
    data = {
      ...defaultOptions,
      message: options,
      gid: getContext()
    };
  } else {
    data = {
      ...defaultOptions,
      gid: getContext(),
      ...options
    };
  }

  return ToastCore(data);
};

const ToastCore = (
  options: Required<
    VanToastProps & {
      onClose?: VoidFunction;
      duration?: number;
    }
  >
) => {
  options.show = true;

  const id = options.gid || getContext();
  if (id === null) return ; // 跳过初次渲染

  const Temp = VanToastMap.get(id);
  if (!Temp) {
    console.error(`未找到 van-toast 节点，请确认 id = ${id} 是否正确`);
    return;
  }
  const { setData, activeToastIns } = Temp; // 取出id对应的组件
  let timer: number | undefined = void 0; // 开启定时id变量

  const clear = () => {
    // 定义回收的函数
    setData({
      show: false
    }); // View 隐藏
    timer !== undefined && clearTimeout(timer); // 清空定时器
    ToastClearQueue.delete(clear); // 删除队列中的 clear 引用
    activeToastIns.current = undefined; // 清空View层中的 clear 引用。
    options.onClose(); // 调用自定义的关闭
  };
  ToastClearQueue.add(clear); // 开始时候增加 clear 到待清空队列
  if (activeToastIns.current) {
    activeToastIns.current(); //
  }
  activeToastIns.current = clear; //
  setData(options);

  if (options.duration > 0) {
    timer = setTimeout(() => {
      clear();
    }, options.duration);
  }

  return { setData, clear };
};

Toast.clear = () => {
  ToastClearQueue.forEach(clear => {
    clear();
  });
  ToastClearQueue.clear();
};

const createMethod = (type: string) => (
  options:
    | NonNullable<VanToastProps["message"]>
    | (VanToastProps & {
      onClose?: VoidFunction;
      duration?: number;
    })
) => {
  let data: Required<VanToastProps & {
    onClose?: VoidFunction;
    duration?: number;
  }>;
  if (typeof options !== "object") {
    data = {
      ...defaultOptions,
      message: options,
      gid: getContext(),
      type
    };
  } else {
    data = {
      ...defaultOptions,
      gid: getContext(),
      ...options,
      type
    };
  }

  return ToastCore(data);
};

Toast.loading = createMethod("loading");
Toast.success = createMethod("success");
Toast.fail = createMethod("fail");

export function useUniToastId() {
  return useMemo(() => Date.now().toString(), []);
}
