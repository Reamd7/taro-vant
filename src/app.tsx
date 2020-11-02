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
      'pages/search/index',
      'pages/field/index',
      'pages/datetime-picker/index',
      'pages/picker/index',
      'pages/calendar/index',

      'pages/index/index',

      'pages/checkbox/index',
      // 基础组件
      'pages/button/index',
      'pages/cell/index',
      'pages/image/index',
      'pages/layout/index',
      'pages/transition/index',
      'pages/popup/index',
      'pages/overlay/index',

      'pages/rate/index',
      'pages/stepper/index',


      'pages/action-sheet/index',
      'pages/notify/index',
      'pages/share-sheet/index',
      'pages/toast/index',
      'pages/swipe-cell/index',
      'pages/nav-bar/index',
      'pages/grid/index',
      'pages/tag/index',
      'pages/count-down/index',
      'pages/divider/index',
      'pages/empty/index',
      'pages/notice-bar/index',
      'pages/skeleton/index',
      'pages/panel/index',
      'pages/steps/index',
      'pages/progress/index'
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
