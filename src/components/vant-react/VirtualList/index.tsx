import Taro from "@tarojs/taro";
import { Component } from '@tarojs/taro' /** api **/;
import "./index.less";
import { View, ScrollView } from "@tarojs/components";
import { ActiveProps, addUnit, createSelectorQuery, ExtClass, noop, } from "../common/utils";
import { ScrollViewProps } from "@tarojs/components/types/ScrollView";
import { BaseEventOrig } from "@tarojs/components/types/common";
import classNames from "classnames";
import { RelationPropsInject } from "../common/relation";
import { debounce } from 'throttle-debounce';

type SuccessCallback = ((this: VanVirtualList, data: {
  virtual: {
    items: any[];
    style: string;
  };
  startIndex: number;
  endIndex: number;
  scrollOffset: number;
  direction: "Down" | "Up";
}) => void) | undefined
export type VanVirtualListIns = {
  render: (items: any[], success?: SuccessCallback) => void,
  scrollTo: (scrollOffset: number, success?: SuccessCallback) => void,
  scrollToIndex: (index: VanVirtualListProps['scrollToIndex'], success?: SuccessCallback) => void,
  setScrollHandler: (_debounce: number) => void
}
export type VanVirtualListProps = {
  pid: string;
  ins?: (
    data: VanVirtualListIns
  ) => void;
  /** 子元素高度 */
  itemHeight?: number;
  /** 可视容器外加载的元素个数，值越大性能越高 */
  itemBuffer?: number;
  /** 设置滚动条到对应子元素的位置 */
  scrollToIndex?: number;
  /** 距顶部多远时，触发 scrolltoupper 事件 */
  upperThreshold?: ScrollViewProps['upperThreshold']
  /** 距底部多远时，触发 scrolltolower 事件 */
  lowerThreshold?: ScrollViewProps['lowerThreshold']
  /** 在设置滚动条位置时使用动画过渡 */
  scrollWithAnimation?: ScrollViewProps['scrollWithAnimation'];
  /** iOS点击顶部状态栏、安卓双击标题栏时，滚动条返回顶部，只支持竖向 */
  enableBackToTop?: ScrollViewProps['enableBackToTop']
  /** 是否禁用滚动 */
  disableScroll?: boolean;
  /** 是否启用页面滚动，默认使用 <scroll-view/> 滚动 */
  enablePageScroll?: boolean;
  /** 可视容器高度 */
  height?: number;
  /** 是否防抖 */
  debounce?: number;

  onChange?: (e: {
    virtual: VanVirtualListState['virtual']
    startIndex: number
    endIndex: number
    scrollOffset: number
    direction: "Down" | "Up"
  }) => void;
  onScroll?: ScrollViewProps['onScroll'];
  onScrollToLower?: ScrollViewProps['onScrollToLower'];
  onScrollToUpper?: ScrollViewProps['onScrollToUpper'];


  'custom-class'?: string;
  className?: string;
}

const DefaultProps = {
  itemHeight: 50,
  itemBuffer: 0,
  scrollToIndex: 0,
  upperThreshold: 50,
  lowerThreshold: 50,
  scrollWithAnimation: false,
  enableBackToTop: false,
  disableScroll: false,
  enablePageScroll: false,
  height: 300,
  debounce: 0,
  onScrollToUpper: noop,
  onScrollToLower: noop
}
const getVisibleItemBounds = (viewTop: number, viewHeight: number, itemCount: number, itemHeight: number, itemBuffer: number) => {
  // visible list inside view
  const listViewTop = Math.max(0, viewTop)

  // visible item indexes
  const startIndex = Math.max(0, Math.floor(listViewTop / itemHeight))
  const endIndex = Math.min(startIndex + Math.ceil(viewHeight / itemHeight) + itemBuffer - 1, itemCount)

  return {
    startIndex,
    endIndex,
  }
}
const mapVirtualToProps = ({ items, itemHeight }: {
  items: any[], itemHeight: number
}, { startIndex, endIndex }: {
  startIndex: number;
  endIndex: number
}) => {
  const visibleItems = endIndex > -1 ? items.slice(startIndex, endIndex + 1) : []

  // style
  const height = items.length * itemHeight
  const paddingTop = startIndex * itemHeight

  return {
    virtual: {
      items: visibleItems,
      style: `height: ${height}px; padding-top: ${paddingTop}px; box-sizing: border-box;`,
    },
  }
}
export type ActiveVanVirtualListProps = ActiveProps<VanVirtualListProps, keyof typeof DefaultProps>
type VanVirtualListState = {
  // wrapStyle: React.CSSProperties, // 最外层容器样式
  scrollOffset: number, // 用于记录滚动条实际位置
  innerScrollOffset: number, // 用于设置滚动条位置
  startIndex: number, // 第一个元素的索引值
  endIndex: number, // 最后一个元素的索引值
  offsetTop: number,
} & ReturnType<typeof mapVirtualToProps>

class VanVirtualList extends Component<VanVirtualListProps, VanVirtualListState> {
  props: ActiveVanVirtualListProps
  static defaultProps = DefaultProps
  static options = {
    addGlobalClass: true
  }
  static externalClasses = [
    'custom-class'
  ]
  state: VanVirtualListState = {
    // wrapStyle: '', // 最外层容器样式
    scrollOffset: 0, // 用于记录滚动条实际位置
    innerScrollOffset: 0, // 用于设置滚动条位置
    startIndex: 0, // 第一个元素的索引值
    endIndex: -1, // 最后一个元素的索引值

    offsetTop: 0,
    ...mapVirtualToProps({
      items: [],
      itemHeight: this.props.itemHeight
    }, {
      startIndex: 0,
      endIndex: -1
    })
  }

  items: any[] = []
  firstRendered = false

  // constructor(props: VanVirtualListProps) {
  //   super(props)
  //   console.log(this);
  //   console.log("VanVirtualList -- constructor")
  //   if (this.$scope) {
  //     debugger
  //   }
  // }

  componentWillMount() {
    console.log("componentWillMount -- attach")
    RelationPropsInject(this, {
      pid: this.props.pid,
      relation: (props: any) => {
        return {
          ...props,
          itemHeight: this.props.itemHeight
        }
      },
      deps: ["itemHeight"],
      loopEnd: (status, PropsList) => {
        console.log(status, PropsList)
      }
    });

    this.props.ins && this.props.ins({
      render: this.__render__,
      scrollTo: this.scrollTo,
      scrollToIndex: this.scrollToIndex,
      setScrollHandler: this.setScrollHandler,
    });
  }
  componentDidMount() {
    console.log("componentDidMount -- ready")

    const { debounce } = this.props
    this.setScrollHandler(debounce)
    this.getBoundingClientRect()
    this.loadData()
  }


  getBoundingClientRect = (callback?: VoidFunction, isForce?: boolean) => {
    if (this.state.offsetTop !== undefined && !isForce) {
      callback && callback.call(this)
      return
    }
    const className = `.van-viruallist`
    createSelectorQuery(this)
      .select(className)
      .boundingClientRect()
      .exec((rect) => {
        if (!rect) return
        this.setState({ offsetTop: rect.top }, ()=> {
          this.state = {
            ...this.state,
            offsetTop: rect.top
          }
          callback && callback.call(this)
        })
      })
  }

  /**
   * 用于计算虚拟列表数据
   * @param {Function} callback 设置完成后的回调函数
   */
  loadData = (callback?: (
    this: this,
    data: {
      virtual: VanVirtualListState['virtual']
      startIndex: number
      endIndex: number
      scrollOffset: number
    }
  ) => void) => {
    const { itemHeight } = this.props
    const { startIndex, endIndex, scrollOffset } = this.state
    const options = {
      items: this.items,
      itemHeight,
    }
    const indexes = {
      startIndex,
      endIndex,
    }
    const values = mapVirtualToProps(options, indexes)
    this.setState(values, () => {
      this.state = {
        ...this.state,
        ...values
      }
      if (typeof callback === 'function') {
        callback.call(this, { ...values, ...indexes, scrollOffset })
      }
    })
  }

  setValue(value: VanVirtualListState[typeof field], field: keyof VanVirtualListState = 'scrollOffset', isForce: boolean = false) {
    if (this.state[field] !== value || isForce) {
      this.setState((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  onChange = (scrollOffset: number, scrolled?: boolean, callback?: SuccessCallback) => {
    const { itemHeight, height, itemBuffer, enablePageScroll } = this.props;

    const {
      startIndex, endIndex, offsetTop,
    } = this.state;
    const itemCount = Math.max(0, this.items.length - 1)
    const listTop = enablePageScroll ? offsetTop : 0
    const viewTop = scrollOffset - listTop;
    const state = getVisibleItemBounds(viewTop, height, itemCount, itemHeight, itemBuffer)
    const hasChanged = state.startIndex !== startIndex || state.endIndex !== endIndex

    // 计算起始点是否可视
    const direction = scrollOffset > this.state.scrollOffset ? 'Down' : 'Up'
    const firstItemVisible = direction === 'Up' && viewTop < startIndex * itemHeight
    const lastItemVisible = direction === 'Down' && viewTop > (endIndex * itemHeight - height)

    // 判断起始点大小
    if (state === undefined || state.startIndex > state.endIndex) return

    // 判断起始点是否发生变化及是否可视状态
    if (hasChanged && (firstItemVisible || lastItemVisible) || scrolled) {
      this.setState(state, () => {
        // wcnm，你这里不是应该渲染完成之后更新完成了this.state的值嘛，你h5端和nevrjs端的实现是不一样的我丢。
        this.state = {
          ...this.state,
          ...state
        }
        this.loadData((values) => {
          // scroll into view
          if (scrolled) {
            this.setValue(scrollOffset, 'innerScrollOffset', true)
          }
          const newValue = {
            direction,
            scrollOffset,
            startIndex: values.startIndex,
            endIndex: values.endIndex,
            virtual: {
              ...values.virtual
            }
          } as const
          // trigger change
          this.props.onChange && this.props.onChange(
            newValue
          )
          // trigger callback
          if (typeof callback === 'function') {
            callback.call(this, newValue)
          }
        })
      })
    }
    // 记录滚动条的位置（仅记录不去设置）
    this.setValue(scrollOffset)
  }

  /**
 * 根据索引值获取偏移量
 * @param {Number} index 指定的索引值
 * @param {Number} itemHeight 子元素高度
 * @param {Number} itemSize 子元素个数
 */
  getOffsetForIndex = (index, itemHeight = this.props.itemHeight, itemSize = this.items.length) => {
    const realIndex = Math.max(0, Math.min(index, itemSize - 1))
    const scrollOffset = realIndex * itemHeight
    return scrollOffset
  }

  shouldComponentUpdate(nextProps: ActiveVanVirtualListProps, nextState: VanVirtualListState) {
    // if (nextProps.itemHeight !== this.props.itemHeight) {
    //   this.updated(nextProps.itemHeight)
    // }
    // if (nextProps.height !== this.props.height) {
    //   this.updatedStyle(nextProps.height)
    // }
    if (nextProps.debounce !== this.props.debounce) {
      this.setScrollHandler(nextProps.debounce)
    }
    if (nextProps.scrollToIndex !== this.props.scrollToIndex) {
      if (this.firstRendered) {
        this.scrollToIndex(nextProps.scrollToIndex)
      }
    }

    if (
      (nextProps.enablePageScroll !== this.props.enablePageScroll) ||
      (nextProps.itemBuffer !== this.props.itemBuffer) ||
      (nextProps.itemHeight !== this.props.itemHeight) ||
      (nextProps.height !== this.props.height)
    ) {
      if (this.firstRendered) {
        this.onChange(nextState.scrollOffset, true)
      }
    }

    return true
  }

  // =========== 滚动事件 ================
  onScroll = (e: BaseEventOrig<ScrollViewProps.onScrollDetail>) => {
    this.onChange(e.detail.scrollTop)
    this.props.onScroll && this.props.onScroll(e)
  }

  scrollHandler = this.props.debounce ? debounce(
    this.props.debounce, false,
    this.onScroll.bind(this)
  ) : this.onScroll

  /**
   * 绑定滚动事件
   * @param {Boolean} _debounce 是否防抖
   */
  setScrollHandler(_debounce = this.props.debounce) {
    this.scrollHandler = _debounce ? debounce(_debounce, false, this.onScroll) : this.onScroll
  };

  // =========== 外部方法 ================
  /**
   * 更新组件
   * @param {Array} items 实际数据列表，当需要动态加载数据时设置
   * @param {Function} success 设置完成后的回调函数
   */
  __render__ = (items: any[], success?: SuccessCallback) => {
    let { scrollOffset } = this.state
    if (Array.isArray(items)) {
      this.items = items
    }

    // 首次渲染时滚动至 scrollToIndex 指定的位置
    if (!this.firstRendered) {
      this.firstRendered = true
      scrollOffset = this.getOffsetForIndex(this.props.scrollToIndex)
    }
    this.getBoundingClientRect(() => this.onChange(scrollOffset, true, success))
  }
  /**
 * 滚动到指定的位置
 * @param {Number} scrollOffset 指定的位置
 * @param {Function} success 设置完成后的回调函数
 */
  scrollTo = (scrollOffset: number, success?: SuccessCallback) => {
    if (typeof scrollOffset === 'number') {
      const offset = Math.max(0, Math.min(scrollOffset, this.items.length * this.props.itemHeight))
      this.onChange(offset, true, success)
    }
  };
  /**
   * 根据索引值滚动到指定的位置
   * @param {Number} index 指定元素的索引值
   * @param {Function} success 设置完成后的回调函数
   */
  scrollToIndex = (index: VanVirtualListProps['scrollToIndex'],
    success?: SuccessCallback
  ) => {
    if (typeof index === 'number') {
      this.onChange(this.getOffsetForIndex(index), true, success)
    }
  }

  render() {
    return <View className={
      classNames(
        ExtClass(this.props, "className"),
        "van-viruallist"
      )} style={!this.props.enablePageScroll ? {
        height: addUnit(this.props.height)
      } : ''}>
      {this.props.disableScroll && <View
        className="van-viruallist__mask"
        onTouchMove={e => e.stopPropagation()}
      />}
      <ScrollView
        className="van-viruallist__scroll-view"
        scrollY={!!(!this.props.enablePageScroll && !this.props.disableScroll)}
        upperThreshold={Math.max(this.props.upperThreshold, this.props.itemHeight)}
        lowerThreshold={Math.max(this.props.lowerThreshold, this.props.itemHeight)}
        // scrollTop={this.state.innerScrollOffset} // H5 切勿用这个
        scrollWithAnimation={this.props.scrollWithAnimation}
        enableBackToTop={this.props.enableBackToTop}
        onScroll={this.scrollHandler}
        onScrollToUpper={this.props.onScrollToUpper}
        onScrollToLower={this.props.onScrollToLower}
      >
        <View className="van-viruallist__scroll-area" style={this.state.virtual && this.state.virtual.style}>
          {this.props.children}
        </View>
      </ScrollView>
    </View >
  }
};


export default VanVirtualList;
