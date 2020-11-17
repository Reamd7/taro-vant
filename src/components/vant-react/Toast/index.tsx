import Taro, { useState, useEffect, useRef } from "@tarojs/taro";
import VanOverlay from "../Overlay";
import VanTransition from "../Transition";
import VanLoading, { VanLoadingProps } from "../Loading";
import VanIcon, { VanIconProps } from "../icon";
import { Block, View, Text } from "@tarojs/components";
import { useMemoClassNames, getContext, useScope } from "../common/utils";
import { VanToastMap } from "./toast";
import "./index.less";
import usePersistFn from "src/common/hooks/usePersistFn";

type VanOverlayProps = React.ComponentProps<typeof VanOverlay>;
// type VanLoadingProps = React.ComponentProps<typeof VanLoading>;
// type VanIconProps = React.ComponentProps<typeof VanIcon>;
export type VanToastProps = {
  gid?: string | ReturnType<typeof getContext>;
  show?: VanOverlayProps["show"];
  mask?: boolean;
  message?: string | number;
  forbidClick?: boolean;
  zIndex?: VanOverlayProps["zIndex"];
  type?: VanIconProps["name"];
  loadingType?: VanLoadingProps["type"];
  position?: string;
};

const VanToast: Taro.FunctionComponent<VanToastProps> = props => {
  const classnames = useMemoClassNames();
  const [data, setData] = useState(props); // 数据响应更新
  useEffect(() => {
    setData(props);
  }, [props]);
  const { mask, show = false, zIndex, position, type, message } = data; // 这里有一个点，就是show不知道为什么不可以默认显示

  const activeToastIns = useRef<() => void>();
  // ========================
  const _setData = usePersistFn((_data: Omit<VanToastProps, "gid">) => {
    setData((data) => {
      return {
        ...data,
        ..._data
      }
    })
  }, [])
  const scope = useScope();

  useEffect(() => {
    if (scope) {
      const id = (data.gid || getContext()); // Taro2 的bug，组件不是按需加载的。
      if (!VanToastMap.has(id)) { // 没有id
        VanToastMap.set(id, {
          // 暴露出组件内部接口
          setData: _setData,
          activeToastIns // 设置当前的运行
        });
      }
    }
    return function () {
      const id = (data.gid || getContext()); // Taro2 的bug，组件不是按需加载的。
      VanToastMap.delete(id);
      if (activeToastIns.current) {
        // 如果当前有正在运行的实例
        activeToastIns.current(); // 则清除他
      }
    };
  }, [data.gid, scope]);
  return (
    <Block>
      {(mask || props.forbidClick) && (
        <VanOverlay
          show={show}
          zIndex={zIndex}
          style={
            mask
              ? undefined
              : {
                backgroundColor: "transparent"
              }
          }
        />
      )}
      <VanTransition
        show={show}
        style={{
          zIndex
        }}
        className="van-toast__container"
        custom-class="van-toast__container"
      >
        <View
          className={classnames(
            "van-toast",
            `van-toast--${
            type === "text" ? "text" : "icon"
            } van-toast--${position}`
          )}
          onTouchMove={e => e.stopPropagation()}
        >
          {type === "text" ? (
            <Text>{message}</Text>
          ) : (
              <Block>
                {type === "loading" ? (
                  <VanLoading
                    color="white"
                    type={props.loadingType}
                    custom-class="van-toast__loading"
                    className="van-toast__loading"
                  />
                ) : (
                    <VanIcon
                      custom-class="van-toast__icon"
                      className="van-toast__icon"
                      name={type}
                    />
                  )}
                {message && <Text>{message}</Text>}
              </Block>
            )}
          {props.children}
        </View>
      </VanTransition>
    </Block>
  );
};
VanToast.defaultProps = {
  zIndex: 1000,
  show: false,
  type: "text",
  loadingType: "circular",
  position: "middle"
};

export default VanToast;
