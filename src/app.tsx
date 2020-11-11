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
      'pages/button/index',         // Button 按钮
      'pages/cell/index',           // Cell 单元格
      // 'pages/icon/index',        // Icon 图标
      'pages/image/index',          // Image 图片
      'pages/layout/index',         // Layout 布局
      'pages/popup/index',          // Popup 弹出层
      'pages/transition/index',     //
      'pages/toast/index',          // Toast 轻提示

      // ================= ## 表单组件 =================
      'pages/calendar/index',       // Calendar 日历
      'pages/checkbox/index',       // Checkbox 复选框
      'pages/datetime-picker/index',// DatetimePicker 时间选择
      'pages/field/index',          // Field 输入框
      // new v2 // NumberKeyboard 数字键盘 // new v2
      // new v2 // PasswordInput 密码输入框 // new v2
      'pages/picker/index',         // Picker 选择器
      // 'pages/radio/index',       // Radio 单选框 TODO
      'pages/rate/index',           // Rate 评分
      'pages/search/index',         // Search 搜索
      /**
       * 最后优化是，直接将用taro写的组件用原生重新实现。
       * 然后taro来mock一层。这个方案没试过，可以试试看看性能，
       * vant原生的实现能够用这种方式做到跟手动画、
       */
      'pages/slider/index',         // Slider 滑块 TODO
      'pages/stepper/index',        // Stepper 步进器 TODO
      'pages/switch/index',         // Switch 开关 TODO 异步
      'pages/uploader/index',       // Uploader 文件上传

      // ================= ## 反馈组件 =================
      'pages/action-sheet/index',   // ActionSheet 动作面板
      // 'pages/dialog/index',      // Dialog 弹出框 TODO
      // 'pages/dropdownmenu/index',// DropdownMenu 下拉菜单 TODO
      'pages/loading/index',     // Loading 加载 TODO
      'pages/notify/index',         // Notify 消息提示
      'pages/overlay/index',        // Overlay 遮罩层
      // new v2 // PullRefresh 下拉刷新 // new v2
      'pages/share-sheet/index',    // ShareSheet 分享面板
      'pages/swipe-cell/index',     // SwipeCell 滑动单元格

      // ================= ## 展示组件 =================
      // new v2 // Badge 徽标 // new v2
      'pages/circle/index',         // Circle 环形进度条
      // 'pages/collapse/index',    // Collapse 折叠面板 TODO
      'pages/count-down/index',     // CountDown 倒计时
      'pages/divider/index',        // Divider 分割线
      'pages/empty/index',          // Empty 空状态
      // new v2 // ImagePreview 图片预览 // new v2
      // new v2 // List 列表 // new v2
      'pages/notice-bar/index',     // NoticeBar 通知栏
      'pages/progress/index',       // Progress 进度条
      'pages/skeleton/index',       // Skeleton 骨架屏
      'pages/steps/index',          // Steps 步骤条
      // 'pages/sticky/index',      // Sticky 粘性布局 TODO
      // new v2 // Swipe 轮播 // new v2
      'pages/tag/index',            // Tag 标签

      'pages/panel/index',
      // ================= ## 导航组件 =================
      'pages/grid/index',           // Grid 宫格
      // 'pages/index-bar/index',   // IndexBar 索引栏 TODO
      'pages/nav-bar/index',        // NavBar 导航栏
      // new v2 // Pagination 分页 // new v2
      // 'pages/slidebar/index',    // Sidebar 侧边导航 TODO
      // 'pages/tab/index',         // Tab 标签页 TODO
      // 'pages/tabbar/index',      // Tabbar 标签栏 TODO
      // 'pages/tree-select/index', // TreeSelect 分类选择 TODO

      // ================= ## 业务组件 =================
      'pages/goods-action/index', // TODO ActionBar 动作栏
      // new v2 // AddressEdit 地址编辑 // new v2
      // new v2 // AddressList 地址列表 // new v2
      // 'pages/area/index',        // Area 省市区选择 TODO
      'pages/card/index',           // Card 卡片
      // new v2 // ContactCard 联系人卡片 // new v2
      // new v2 // ContactEdit 联系人编辑 // new v2
      // new v2 // ContactList 联系人列表 // new v2
      // new v2 // Coupon 优惠券选择器 // new v2
      // 'pages/submitBar/index',   // SubmitBar 提交订单栏 TODO
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
