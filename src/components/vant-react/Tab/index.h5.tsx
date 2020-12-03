import Taro, { useState, useMemo, useEffect, useLayoutEffect, useRef, } from '@tarojs/taro';
import "./index.less";
import { ActiveProps, useMemoClassNames, useMemoBem, ExtClass, useMemoCssProperties, useScopeRef, getAllRect, getRect, noop, nextTick, addUnit } from '../common/utils';
import { View, ScrollView, Swiper, SwiperItem } from '@tarojs/components';
import VanSticky, { VanStickyProps } from '../Sticky';
import usePersistFn from 'src/common/hooks/usePersistFn';
import { useTouch } from '../common/mixins/touch';
import { ITouchEvent } from '@tarojs/components/types/common';
import VanInfo from '../info';
import { useRelationPropsInject } from '../common/relation';
import { ActiveVanTabItemProps, VanTabItemProps } from './item';
import ResizeObserver from 'resize-observer-polyfill';
import Nerv from "nervjs";

export type Tab = {
  name?: string | number;
  index: number;
  title: string;
  disabled?: boolean;
  dot?: boolean;
  info?: string | number;
  titleStyle?: React.CSSProperties | string;
}
export type VanTabProps = {
  defaultActive?: number;
  active?: number | string;
  color?: string;
  zIndex?: VanStickyProps['zIndex'];
  type?: "line" | "card";
  border?: boolean;
  duration?: number;
  lineWidth?: number | string;
  lineHeight?: number | string;
  swipeThreshold?: number;
  animated?: boolean;
  ellipsis?: boolean;
  sticky?: VanStickyProps['disabled'];
  swipeable?: boolean;
  lazyRender?: boolean;
  offsetTop?: VanStickyProps['offsetTop'];

  useSwiper?: boolean;
  noContent?: (fn: {
    onTouchStart: (e: ITouchEvent) => void
    onTouchMove: (e: ITouchEvent) => void
    onTouchEnd: () => void
  }) => void;

  container?: () => Taro.NodesRef;

  children?: React.ReactNode
  renderNavLeft?: React.ReactNode;
  renderNavRight?: React.ReactNode;

  titleActiveColor?: string;
  titleInactiveColor?: string
  tabs?: Array<Tab>

  "custom-class"?: string;
  className?: string;
  "nav-class"?: string;
  navClass?: string;
  "tab-class"?: string;
  tabClass?: string;
  "tab-active-class"?: string;
  tabActiveClass?: string;

  onClick?: (data: Tab) => void;
  onChange?: (data: Tab) => void;
  onDisabled?: (data: Tab) => void;
  onScroll?: (data: {
    scrollTop: number,
    isFixed: boolean
  }) => void;

  pid: string;
}

const externalClasses = [
  "custom-class",
  "nav-class",
  "tab-class",
  "tab-active-class"
]

const DefaultProps = {
  defaultActive: 0,
  color: "#ee0a24",
  zIndex: 1,
  type: "line" as "line" | "card",
  border: false,
  duration: 0.3,
  lineWidth: 40,
  lineHeight: 3,
  swipeThreshold: 5,
  animated: false,
  ellipsis: true,
  sticky: false,
  swipeable: false,
  lazyRender: true,
  offsetTop: 0,
  // tabs: [],
  onClick: noop,
  onChange: noop,
  onDisabled: noop,
  onScroll: noop,
}

export type ActiveVanTabProps = ActiveProps<VanTabProps, keyof typeof DefaultProps>;

function tabStyle(
  active,
  ellipsis,
  color,
  type,
  disabled,
  activeColor,
  inactiveColor,
  swipeThreshold,
  scrollable
) {
  var styles: string[] = [];
  var isCard = type === 'card';
  // card theme color
  if (color && isCard) {
    styles.push('border-color:' + color);

    if (!disabled) {
      if (active) {
        styles.push('background-color:' + color);
      } else {
        styles.push('color:' + color);
      }
    }
  }

  var titleColor = active ? activeColor : inactiveColor;
  if (titleColor) {
    styles.push('color:' + titleColor);
  }

  if (scrollable && ellipsis) {
    styles.push('flex-basis:' + 88 / swipeThreshold + '%');
  }

  return styles.join(';');
}

const VanTab: Taro.FunctionComponent<VanTabProps> = (props: ActiveVanTabProps) => {
  const classname = useMemoClassNames();
  const bem = useMemoBem();
  const css = useMemoCssProperties()

  const {
    active,

    type,
    sticky,
    zIndex,
    offsetTop,
    border,
    color,
    swipeable,
    duration,
    lineWidth,
    lineHeight,
    titleActiveColor,
    titleInactiveColor,
    animated,
    lazyRender,
    container,

    ellipsis,
    swipeThreshold
  } = props;


  const [data, setData] = useState({
    // lineStyle: '',
    scrollLeft: 0,
    // scrollable: false,
    // trackStyle: '',
    currentIndex: -1,
    skipTransition: true,
    lineOffsetLeft: 0,
  });
  const initRef = useRef(false);
  const [forceUpdate, SetForceUpdate] = useState({});
  useEffect(()=>{
    if (props.tabs && props.tabs.length) {
      initRef.current = true
      SetForceUpdate({})
    }
  }, [])
  const relationTabs = useRelationPropsInject<ActiveVanTabItemProps>(props.pid, (props: VanTabItemProps) => {
    if (!initRef.current && props.index === props.total - 1) {
      initRef.current = true
      SetForceUpdate({})
    }
    return {
      ...props,
      active: data.currentIndex === props.index,
      lazyRender,
      animated
    };
  }, [data.currentIndex, lazyRender, animated])

  let tabs = props.tabs ? props.tabs : relationTabs;
  const {
    // lineStyle,
    scrollLeft,
    // scrollable,
    // trackStyle,
    skipTransition,
    lineOffsetLeft,
  } = data
  const scrollable = useMemo(() => {
    return tabs.length > swipeThreshold || !ellipsis
  }, [tabs, swipeThreshold, ellipsis]);

  // const [container, setContainer] = useState<() => Taro.NodesRef>()
  const [scope, scopeRef] = useScopeRef();

  const setLine = usePersistFn((currentIndex: number, skipTransition = false) => {
    if (type !== 'line') return;

    Promise.all([
      getAllRect(scope, `.van-tab`),
      getRect(scope, `.van-tabs__line`)
    ]).then(([rects = [], lineRect]) => {
      const rect = rects[currentIndex];

      if (rect == null) {
        return;
      }

      let lineOffsetLeft = rects
        .slice(0, currentIndex)
        .reduce((prev, curr) => prev + curr.width, 0);
      // let lineOffsetLeft = rect.left; // 微信小程序是可以这么写，但是支付宝有bug不可以，只能用上面的方式了
      lineOffsetLeft += (rect.width - lineRect.width) / 2;

      setData((data) => ({
        ...data,
        lineOffsetLeft,
        skipTransition
      }))
    })
  }, [type, scope]);

  const updateContainer = usePersistFn(() => {
    // TODO container
    // setContainer(
    //   () => () => Taro.createSelectorQuery().in(scope).select('.van-tabs')
    // )
  }, [scope]);

  const scrollIntoView = usePersistFn((currentIndex: number) => {
    if (!scrollable) return;
    Promise.all([
      getAllRect(scope, `.van-tab`),
      getRect(scope, `.van-tabs__nav`),
    ]).then(([tabRects, navRect]) => {
      const tabRect = tabRects[currentIndex];
      const offsetLeft = tabRects
        .slice(0, currentIndex)
        .reduce((prev, curr) => prev + curr.width, 0);

      setData(data => ({
        ...data,
        scrollLeft: offsetLeft - (navRect.width - tabRect.width) / 2,
      }));
    });
  }, [scope, scrollable])

  const setCurrentIndex = usePersistFn((currentIndex: number) => {
    if (currentIndex >= tabs.length || currentIndex < 0) return;
    if (currentIndex === data.currentIndex) return;
    setData((data) => {
      return {
        ...data,
        currentIndex
      }
    })
    nextTick(() => {
      setLine(currentIndex);
      scrollIntoView(currentIndex);
      updateContainer();
      props.onChange(tabs[currentIndex])
    })

  }, [tabs, data.currentIndex, props.onChange])

  const setCurrentIndexByName = usePersistFn((name: string | number) => {
    const matched = tabs.filter((v, i) => (v.name === name || i === name));
    if (matched.length) {
      setCurrentIndex(matched[0].index);
    }
  }, [tabs])

  const onTap = usePersistFn((index: number) => {
    const data = tabs[index];

    if (data.disabled) {
      props.onDisabled(data)
    } else {
      setCurrentIndex(index);
      nextTick(() => {
        props.onClick(data)
      })
    }
  }, [tabs, props.onDisabled, props.onClick])

  const getAvaiableTab = usePersistFn((direction: number) => {
    // const { tabs, currentIndex } = this.data;
    const step = direction > 0 ? -1 : 1;

    for (
      let i = step;
      data.currentIndex + i < tabs.length && data.currentIndex + i >= 0;
      i += step
    ) {
      const index = data.currentIndex + i;

      if (
        index >= 0 &&
        index < tabs.length &&
        tabs[index] &&
        !tabs[index].disabled
      ) {
        return index;
      }
    }

    return -1;
  }, [tabs, data.currentIndex])

  const touch = useTouch()

  const onTouchStart = usePersistFn((e: ITouchEvent) => {
    if (!swipeable) return;
    touch.touchStart.current(e)
  }, [swipeable]);

  const onTouchMove = usePersistFn((e: ITouchEvent) => {
    if (!swipeable) return;
    touch.touchMove.current(e)
  }, [swipeable])

  const onTouchEnd = usePersistFn(() => {
    if (!swipeable) return;
    const {
      direction, deltaX, offsetX
    } = touch.touchRef.current;
    const minSwipeDistance = 50;
    if (direction === 'horizontal' && offsetX >= minSwipeDistance) {
      const index = getAvaiableTab(deltaX);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [swipeable, getAvaiableTab])


  const observerCallback = usePersistFn(function (entries, observer) {
    if (initRef.current) {
      if (active != undefined) {
        setTimeout(() => {
          if (typeof active === "number") {
            setCurrentIndex(active)
          } else {
            setCurrentIndexByName(active)
          }
        })
      }
      else {
        setTimeout(() => {
          setCurrentIndex(props.defaultActive)
        })
      }
    }

  } as ResizeObserverCallback, [data.currentIndex])
  const ob = useMemo(() => new ResizeObserver(observerCallback), [])
  useEffect(() => {
    scope &&
      (scope._rendered.dom as HTMLDivElement).querySelectorAll(".van-tab").forEach(v => {
        ob.observe(
          v
        );
      })

    return function () {
      scope &&
        (scope._rendered.dom as HTMLDivElement).querySelectorAll(".van-tab").forEach(v => {
          ob.unobserve(
            v
          );
        })
    }
  }, [scope])

  // 如果使用自定义, 就自动注入.
  useEffect(() => {
    if (props.noContent) {
      props.noContent({
        onTouchStart,
        onTouchMove,
        onTouchEnd
      })
    }
  }, [props.noContent])

  return <View className={
    classname(
      ExtClass(props, "custom-class"),
      bem('tabs', [type])
    )
  } ref={scopeRef}>
    <VanSticky
      disabled={!sticky}
      zIndex={zIndex}
      offsetTop={offsetTop}
      container={container || null}
      onScroll={props.onScroll}
    >
      <View
        className={
          classname(
            bem('tabs__wrap', { scrollable }),
            type === 'line' && border ? 'van-hairline--top-bottom' : ''
          )
        }
      >
        {props.renderNavLeft}
        <ScrollView
          scrollX={scrollable}
          scrollWithAnimation
          scrollLeft={scrollLeft}
          className={bem('tabs__scroll', [type])}
          style={css({
            borderColor: color,
            width: "100%"
          })}
        >
          <View
            className={
              classname(
                bem('tabs__nav', [type, { complete: !ellipsis }]),
                ExtClass(props, "nav-class")
              )
            }
            style={css({
              borderColor: type === "card" ? color : '',
            })}
          >
            {type === 'line' &&
              <View
                className="van-tabs__line"
                style={css({
                  width: addUnit(lineWidth),
                  transform: `translateX(${lineOffsetLeft}px)`,
                  backgroundColor: color,
                  transitionDuration: skipTransition ? undefined : duration + "s",
                  height: lineHeight !== -1 ? addUnit(lineHeight) : undefined,
                  borderRadius: lineHeight !== -1 ? addUnit(lineHeight) : undefined,
                })}
              />
            }
            {tabs.map((item, index) => {
              return <View
                key={item.index} data-index={index}
                className={
                  classname(
                    ExtClass(props, "tabClass"),
                    index === data.currentIndex && ExtClass(props, "tabActiveClass"),
                    ellipsis && 'van-ellipsis',
                    // getters.tabClass(index === currentIndex, ellipsis),
                    bem('tab', { active: index === data.currentIndex, disabled: item.disabled, complete: !ellipsis })
                  )
                }
                style={
                  tabStyle(index === data.currentIndex, ellipsis, color, type, item.disabled, titleActiveColor, titleInactiveColor, swipeThreshold, scrollable)
                }
                onTouchEnd={() => onTap(index)}
              >
                <View
                  className={ellipsis ? 'van-ellipsis' : ''}
                  style={item.titleStyle}
                >
                  {item.title}
                  {(item.dot || item.info !== null) &&
                    <VanInfo
                      info={item.info}
                      dot={item.dot}
                      className="van-tab__title__info"
                      custom-class="van-tab__title__info"
                    />}
                </View>
              </View>
            })}
          </View>
        </ScrollView>
        {props.renderNavRight}
      </View>
      {(props.noContent && props.tabs) ? null :
        ((props.useSwiper && props.tabs) ?
          <Swiper
          circular={false}
            className="van-tabs__content"
            current={data.currentIndex}
            // onTouchStart={onTouchStart}
            // onTouchMove={onTouchMove}
            // onTouchEnd={onTouchEnd}
            // onTouchCancel={onTouchEnd}
            // onTransition={(e) => {
            //   console.log("onTransition", e)
            // }}
            // onAnimationFinish={(e) => {
            //   console.log("onAnimationFinish", e)
            // }}
            onChange={(e) => {
              setCurrentIndex(e.detail.current)
              // console.log("onChange", e)
            }}
          >
            {props.tabs.map(function(v, index) {
              return <SwiperItem key={v.index}>
                {(props.children && props.children[index]) ? props.children[index] : null}
              </SwiperItem>
            })}
          </Swiper> :
          <View
            className="van-tabs__content"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}
          >
            <View
              className={
                classname(
                  bem('tabs__track', [{ animated }]),
                  "van-tabs__track"
                )
              }
              style={animated ? css({
                left: -100 * data.currentIndex + '%',
                transitionDuration: duration + "s"
              }) : ''}
            >
              {props.children}
            </View>
          </View>)}
    </VanSticky>
  </View>
}

VanTab.defaultProps = DefaultProps
VanTab.externalClasses = externalClasses;
VanTab.options = {
  addGlobalClass: true
}
export default VanTab
