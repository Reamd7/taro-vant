import { Block, ScrollView, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
const { useState, useMemo, useCallback, useRef, useEffect } = Taro /** api **/;
import './index.less'
import { throttle } from "throttle-debounce"
import { ActiveProps, getSystemInfoSync, isWeapp, useScopeRef, ExtClass, isH5, getAllRect, getRect } from 'taro-vant/utils'
import { ITouchEvent } from '@tarojs/components/types/common'
import usePersistFn from 'taro-vant/hooks/usePersistFn'

export type VanIndexListProps = {
  list: Array<{
    alpha: string;
    subItems: Array<{
      name: string | number;
    }>
  }>
  vibrated?: boolean

  onChoose: (item: {
    name: string | number;
  }) => void

  className?: string
  ['custom-class']?: string;
}
const DefaultProps = {
  list: [],
  vibrated: true
}
export type ActiveVanIndexListProps = ActiveProps<VanIndexListProps, keyof typeof DefaultProps>

const VanIndexList: Taro.FC<VanIndexListProps> = (props: ActiveVanIndexListProps) => {
  const {
    list, vibrated
  } = props;
  const windowHeight = useMemo(() => getSystemInfoSync().windowHeight, []);
  const alphabet = useMemo(() => {
    return list.map(function (item) {
      return item.alpha
    })
  }, [list])
  const [current, setCurrent] = useState(alphabet[0])
  const [intoView, setintoView] = useState('')
  const [touching, settouching] = useState(false);

  const [scope, scopeRef] = useScopeRef();

  const ins = useRef<{
    _tops: number[];
    _anchorItemH: number;
    _anchorItemW: number;
    _anchorTop: number;
    _listUpperBound: number;
  }>({
    _tops: [] as number[],
    _anchorItemH: 0,
    _anchorItemW: 0,
    _anchorTop: 0,
    _listUpperBound: 0,
  })
  const __scrollTo = usePersistFn(function (e: ITouchEvent) {
    var clientY = (e.changedTouches as unknown as Array<{
      clientX: 361
      clientY: 184
      force: 1
      identifier: 0
      pageX: 361
      pageY: 184
    }>)[0].clientY;
    var index = Math.floor((clientY - ins.current._anchorTop) / ins.current._anchorItemH)
    var current = alphabet[index]
    setCurrent(current)
    setintoView(current)
    settouching(true)
    if (isWeapp) {
      if (vibrated) wx.vibrateShort();
    } else if (isH5) {
      // if (vibrated && navigator.vibrate) navigator.vibrate(200)
    }
  }, [alphabet])
  const _onScroll = usePersistFn(function (e: ITouchEvent) {
    var _tops = ins.current._tops;
    var scrollTop = e.detail.scrollTop
    var current = ''
    if (scrollTop < _tops[0]) {
      current = alphabet[0]
    } else {
      for (var i = 0, len = _tops.length; i < len - 1; i++) {
        if (scrollTop >= _tops[i] && scrollTop < _tops[i + 1]) {
          current = alphabet[i]
        }
      }
    }
    if (!current) current = alphabet[alphabet.length - 1]
    setCurrent(current)
  }, [alphabet])
  const computedSize = usePersistFn(function () {
    getAllRect(scope, '.index_list_item')
      .then(function (rects) {
        var result = rects
        ins.current._tops = result.map(function (item) {
          return item.top
        })
      });

    getRect(scope, '.anchor-list')
      .then(function (rect) {
        ins.current._anchorItemH = rect.height / alphabet.length
        ins.current._anchorItemW = rect.width
        ins.current._anchorTop = rect.top
      });
    getRect(scope, '.page-select-index')
      .then(function (rect) {
        ins.current._listUpperBound = rect.top
      })
  }, [scope, alphabet])

  useEffect(() => {
    if (scope) {
      setCurrent(alphabet[0])
      computedSize()
    }
  }, [scope, alphabet])

  const onScroll = useMemo(() => throttle(100, _onScroll), [])
  const scrollTo = useMemo(() => throttle(100, __scrollTo), [])
  const removeTouching = useCallback(() => {
    setTimeout(() => {
      settouching(false)
    }, 150)
  }, []);

  return (
    <View ref={scopeRef} className={
      ExtClass(props, "className")
    }>
      <ScrollView
        className="page page-select-index"
        style={'height: ' + windowHeight + 'px;'}
        enableBackToTop
        scrollIntoView={intoView}
        scrollY
        onScroll={_onScroll}
      >
        <View>{props.children}</View>
        {list.map((item,) => {
          return (
            <View className="index_list_item" key={item.alpha} id={item.alpha}>
              <View className="index-group__title font-size-26 tips-color">
                {item.alpha}
              </View>
              <View className="index-group__content">
                <View className="index-group__list">
                  {item.subItems.map((subItem) => {
                    return (
                      <Block key="name">
                        <View
                          className="index-group__item thin-border-bottom"
                          hoverClass="bg-highlight"
                          // data-item={subItem}
                          // onClick={() => {
                          //   props.onChoose && props.onChoose(subItem)
                          // }}
                        >
                          {subItem.name}
                        </View>
                      </Block>
                    )
                  })}
                </View>
              </View>
            </View>
          )
        })}
      </ScrollView>
      <View
        className="anchor-bar__wrp wx-flex"
        onTouchStart={__scrollTo}
        onTouchMove={__scrollTo}
        onTouchEnd={removeTouching}
      >
        <View className="anchor-bar wx-flex__item">
          <View className="anchor-list">
            {alphabet.map((alpha) => {
              return (
                <Block key={alpha}>
                  <View
                    className={
                      'anchor-item ' +
                      (current == alpha
                        ? touching
                          ? 'selected tapped'
                          : 'selected'
                        : '')
                    }
                  // data-alpha={alpha}
                  >
                    <View className="anchor-item__inner">{alpha}</View>
                    <View className="anchor-item__pop">{alpha}</View>
                  </View>
                </Block>
              )
            })}
          </View>
        </View>
      </View>
    </View>
  )
}

VanIndexList.options = {
  addGlobalClass: true
}

VanIndexList.defaultProps = DefaultProps
VanIndexList.externalClasses = [
  'custom-class'
]
export default VanIndexList
