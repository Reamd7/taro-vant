import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/index'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/index/index',

      // ================= ## 基础组件 =================
      'pages/button/index',
      'pages/cell/index',
      // 'pages/icon/index',
      'pages/image/index',
      'pages/layout/index',
      'pages/popup/index',
      'pages/transition/index',

      // ================= ## 表单组件 =================
      'pages/calendar/index',
      'pages/checkbox/index',
      'pages/datetime-picker/index',
      'pages/field/index',
      'pages/picker/index',
      // 'pages/radio/index', // TODO
      'pages/rate/index',
      'pages/search/index',
        // 最后优化是，直接将用taro写的组件用原生重新实现。
        // 然后taro来mock一层。这个方案没试过，可以试试看看性能，
        // vant原生的实现能够用这种方式做到跟手动画、
      'pages/slider/index', // TODO
      'pages/stepper/index',
      'pages/switch/index', // TODO 异步
      'pages/uploader/index',

      // ================= ## 反馈组件 =================
      'pages/action-sheet/index',
      // 'pages/dialog/index', // TODO
      // 'pages/dropdownmenu/index', // TODO
      // 'pages/loading/index', // TODO
      'pages/notify/index',
      'pages/overlay/index',
      'pages/share-sheet/index',
      'pages/swipe-cell/index',
      'pages/toast/index',

      // ================= ## 展示组件 =================
      // 'pages/circle/index', // TODO
      // 'pages/collapse/index', // TODO
      'pages/count-down/index',
      'pages/divider/index',
      'pages/empty/index',
      'pages/notice-bar/index',
      'pages/panel/index',
      'pages/progress/index',
      'pages/skeleton/index',
      'pages/steps/index',
      // 'pages/sticky/index', // TODO
      'pages/tag/index',
      // 'pages/tree-select/index', // TODO

      // ================= ## 导航组件 =================
      'pages/grid/index',
      // 'pages/index-bar/index', // TODO
      // 'pages/slidebar/index', // TODO
      'pages/nav-bar/index',
      // 'pages/tab/index', // TODO
      // 'pages/tabbar/index', // TODO
      // ================= ## 业务组件 =================
      // 'pages/area/index', // TODO
      // 'pages/card/index', // TODO
      // 'pages/submitBar/index', // TODO
      // 'pages/goodsAction/index', // TODO
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      // navigationStyle: "custom"
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
