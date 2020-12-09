import Taro from "@tarojs/taro";
import { useState, useCallback, useEffect } from "react";
import { View } from "@tarojs/components";
import "./VanDropDownMenu.less";
import { getSystemInfoSync, ActiveProps, useMemoBem, useMemoClassNames, useMemoCssProperties, getRect, addUnit, useScope, useScopeRef } from "../common/utils";
import { useRelationPropsInject } from "../common/relation";
import { VanDropDownItemProps, ActiveVanDropDownItemProps } from "./VanDropDownItem";
import useControllableValue, { ControllerValueProps } from "src/common/hooks/useControllableValue";

function displayTitle(item: {
  title?: string;
  value?: string | number;
  options?: Array<{
    value?: string | number;
    text?: string;
  }>
}) {
  if (item.title) {
    return item.title;
  }

  if (item.options) {
    var match = item.options.filter(function (option) {
      return option.value === item.value;
    });
    var displayTitle = match.length ? match[0].text : '';
    return displayTitle;
  } else {
    return ''
  }
}

export type VanDropDownMenuProps = {
  gid: string;

  activeColor?: string;
  overlay?: boolean;
  zIndex?: number;
  duration?: number;
  direction?: string;
  closeOnClickOverlay?: boolean;
  closeOnClickOutside?: boolean;

} & ControllerValueProps<number | null, "defaultActiveIndex", "activeIndex">;

export const DropDownMenuDefaultProps = {
  overlay: true,
  zIndex: 10,
  duration: 200,
  direction: "down",
  closeOnClickOverlay: true,
  closeOnClickOutside: true,
  defaultActiveIndex: null
} as const;


export const VanDropDownMenuMap = new Map<string, {
  parent: ActiveVanDropDownMenuProps
}>();

export type ActiveVanDropDownMenuProps = ActiveProps<VanDropDownMenuProps, keyof typeof DropDownMenuDefaultProps>

const ARRAY = new Set<(v: number | null) => void>(); // TODO 要不要做单例？

const VanDropDownMenu: Taro.FunctionComponent<VanDropDownMenuProps> = (props: ActiveVanDropDownMenuProps) => {
  const [windowHeight] = useState(() => {
    const { windowHeight } = getSystemInfoSync();
    return windowHeight
  });

  const {
    overlay,
    duration,
    activeColor,
    closeOnClickOverlay,
    direction,
    zIndex,
  } = props;
  const bem = useMemoBem();
  const classnames = useMemoClassNames();
  const css = useMemoCssProperties();

  const [scope, scopeRef] = useScopeRef();
  /**
   * WrapperStyle
   */
  const getChildWrapperStyle = useCallback(() => {
    return getRect(scope, '.van-dropdown-menu').then(rect => {
      const { top = 0, bottom = 0 } = rect;
      const offset = direction === 'down' ? bottom : windowHeight - top;

      let wrapperStyle: React.CSSProperties = {
        zIndex,
      }
      if (direction === 'down') {
        wrapperStyle['top'] = addUnit(offset);
      } else {
        wrapperStyle['bottom'] = addUnit(offset);
      }
      return wrapperStyle;
    })
  }, [zIndex, direction, windowHeight, scope, addUnit]);

  const [activeIndex, setActiveIndex] = useControllableValue<number | null, ActiveVanDropDownMenuProps, "defaultActiveIndex", "activeIndex">(props, {
    defaultValue: null,
    defaultValuePropName: "defaultActiveIndex",
    valuePropName: "activeIndex"
  });
  // 这里的状态 当为undefined时候 => 即主动关闭，
  // 当为数字的时候，即切换。
  // 主动关闭是有动画的。
  // 切换是没有动画的。

  const onFocusClose = useCallback(() => {
    setActiveIndex(null)
  }, []);

  const onCloseOther = useCallback(()=>{
    ARRAY.forEach(v => {
      if (v !== setActiveIndex) {
        v(null)
      }
    })
  }, [])

  useEffect(() => {
    ARRAY.add(setActiveIndex)
    return function () {
      ARRAY.delete(setActiveIndex)
    }
  }, [])

  const [ValueList, setValueList] = useState<
    Array<string | undefined | number>
  >([]);

  // console.log(ValueList)

  const itemListData = useRelationPropsInject<VanDropDownItemProps>(props.gid, (props) => {
    const index = props.index;

    const value = (ValueList[index] !== undefined) ? ValueList[index] : props.value;

    const newProps = {
      ...props,
      // 将父级的类型注入都子级中。
      overlay,
      duration,
      activeColor,
      closeOnClickOverlay,
      direction,
      value,
      onChange: ((item) => {
        if (item) {
          setValueList((v) => {
            const list = v.slice();
            list[index] = item.value;
            // console.log(index + "before update")
            return list
          })
        }
      }),

      onFocusClose,
      index,
      activeIndex,
      getChildWrapperStyle
    } as ActiveVanDropDownItemProps
    // console.log(index + "update newProps" , JSON.stringify(props));

    return newProps;
  }, [
    overlay,
    duration,
    activeColor,
    closeOnClickOverlay,
    direction,

    ValueList,
    onFocusClose,
    activeIndex,
    getChildWrapperStyle
  ]);

  // console.log("itemListData", JSON.stringify(itemListData))

  return (
    <View className="van-dropdown-menu van-dropdown-menu--top-bottom" ref={scopeRef}>
      {itemListData.map((item, index) => {
        return <View
          className={
            bem('dropdown-menu__item', { disabled: item.disabled })
          }
          onClick={() => {
            if (!item.disabled) {
              if (activeIndex === index) {
                setActiveIndex(null) // 关闭
              } else {
                setActiveIndex(index) // 打开
                onCloseOther()
              }
            }
          }}
        >
          <View
            className={
              classnames(
                item.titleClass,
                bem('dropdown-menu__title', { active: (activeIndex === index), down: (activeIndex === index) === (props.direction === 'down') })
              )
            }
            style={css({
              color: (activeIndex === index) ? activeColor : undefined
            })}
          >
            <View className="van-ellipsis">
              {displayTitle(item)}
            </View>
          </View>
        </View>
      })}
      {props.children}
    </View >
  );
};
VanDropDownMenu.defaultProps = DropDownMenuDefaultProps;
VanDropDownMenu.options = {
  addGlobalClass: true
};
export default VanDropDownMenu;
