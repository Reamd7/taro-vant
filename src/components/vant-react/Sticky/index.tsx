import Taro, { NodesRef } from "@tarojs/taro";
import { useEffect, useRef, useState, useCallback } from '@tarojs/taro' /** api **/;
import "./index.less";
import { ActiveProps, useMemoClassNames, useMemoBem, isExternalClass, isNormalClass, useMemoCssProperties, getRect, useMemoAddUnit, useScopeRef } from "../common/utils";
import { View } from "@tarojs/components";
import usePersistFn from "src/common/hooks/usePersistFn";
import usePageScrollMixin from "../common/mixins/page-scroll";

export type VanStickyProps = {
  zIndex?: number;
  offsetTop?: number;
  disabled?: boolean;
  container?: null | (() => Taro.NodesRef);
  scrollTop?: number;

  className?: string;
  ['custom-class']?: string;

  onScroll?: (e: {
    scrollTop: number;
    isFixed: boolean;
  }) => void;
}

const DefaultProps = {
  zIndex: 99,
  offsetTop: 0
}

type ActiveVanStickyProps = ActiveProps<VanStickyProps, keyof typeof DefaultProps>
const ROOT_ELEMENT = '.van-sticky';

const VanSticky: Taro.FunctionComponent<VanStickyProps> = (props: ActiveVanStickyProps) => {
  const classnames = useMemoClassNames();
  const bem = useMemoBem();
  const css = useMemoCssProperties();
  const addUnit = useMemoAddUnit();

  const [__data__, setData] = useState({
    height: 0,
    fixed: false, // 是否吸顶
    transform: 0, // transform 模拟容器内滚动
  })

  const { container, offsetTop, disabled } = props;

  const __scrollTop__ = useRef(props.scrollTop || 0)
  // const [__scrollTop__, setScrollTop] = useState(props.scrollTop || 0);

  const setDataAfterDiff = useCallback((data: Partial<typeof __data__>) => {
    const selfData = {
      ...__data__,
      ...data
    }
    setData(selfData);

    props.onScroll && props.onScroll({
      scrollTop: __scrollTop__.current,
      isFixed: selfData.fixed
    })
  }, [__data__, props.onScroll, __scrollTop__])

  // const getContainerRect = useCallback(() => {
  //   if (container) {
  //     const nodesRef = container();
  //     return new Promise<NodesRef.BoundingClientRectCallbackResult>((resolve) =>
  //       nodesRef.boundingClientRect(resolve).exec()
  //     );
  //   }
  //   return Promise.resolve<NodesRef.BoundingClientRectCallbackResult | null>(null);
  // }, [container]);

  const [scope, scopeRef] = useScopeRef();

  const onScroll = usePersistFn(({ scrollTop }: Taro.PageScrollObject = { scrollTop: 0 }) => {
    if (!scope) return;
    if (disabled) {
      setDataAfterDiff({
        fixed: false,
        transform: 0,
      });
      return;
    }
    __scrollTop__.current = (scrollTop || __scrollTop__.current)

    if (container) {
      Promise.all([
        getRect(scope, ROOT_ELEMENT),
        new Promise<NodesRef.BoundingClientRectCallbackResult>((resolve) => {
          // getContainerRect
          const nodesRef = container();
          nodesRef.boundingClientRect(resolve).exec()
        })
      ]).then(([root, container]) => {
        if (offsetTop + root.height > container.height + container.top) {
          setDataAfterDiff({
            fixed: false,
            transform: container.height - root.height,
          });
        } else if (offsetTop >= root.top) {
          setDataAfterDiff({
            fixed: true,
            height: root.height,
            transform: 0,
          });
        } else {
          setDataAfterDiff({ fixed: false, transform: 0 });
        }
      })

      return;
    } else {
      getRect(scope, ROOT_ELEMENT).then((root) => {
        if (offsetTop >= root.top) {
          setDataAfterDiff({ fixed: true, height: root.height, transform: 0 });
        } else {
          setDataAfterDiff({ fixed: false });
        }
      });
    }

  }, [scope, setDataAfterDiff, container, offsetTop, disabled]);

  usePageScrollMixin(onScroll, !!props.disabled)

  useEffect(() => {
    if (scope) {
      // 组件挂载后，获取当前组件的大小
      onScroll({
        scrollTop: props.scrollTop || 0
      });
    }
  }, [scope, offsetTop, disabled, container])

  return <View
    className={
      classnames(
        isNormalClass && props.className,
        isExternalClass && 'custom-class',
        'van-sticky'
      )
    }
    style={css({
      height: __data__.fixed ? addUnit(__data__.height) : undefined,
      zIndex: props.zIndex
    })}
    ref={scopeRef}
  >
    <View className={bem('sticky-wrap', { fixed: __data__.fixed })}
      style={css({
        transform: 'translate3d(0, ' + __data__.transform + 'px, 0);',
        top: __data__.fixed ? addUnit(offsetTop) : undefined,
        zIndex: props.zIndex
      })}
    >
      {props.children}
    </View>
  </View>
}


VanSticky.externalClasses = [
  'custom-class'
]

VanSticky.options = {
  addGlobalClass: true
}

VanSticky.defaultProps = DefaultProps

export default VanSticky
