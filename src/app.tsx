import Taro, { Component, Config } from '@tarojs/taro'
import Index from './root/index'

import './app.less'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
if (process.env.TARO_ENV === 'h5') {
  require('./components/vant-react/common/mocknav/mocknative')
}
class App extends Component {

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'root/index/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      // navigationStyle: "custom"
    },
    subPackages: [
      {
        "root": "pages",
        "pages": [
          // ================= ## 基础组件 =================
          'button/index',         // Button 按钮
          'cell/index',           // Cell 单元格
          // 'icon/index',        // Icon 图标
          'image/index',          // Image 图片
          'layout/index',         // Layout 布局
          'popup/index',          // Popup 弹出层
          'transition/index',     //
          'toast/index',          // Toast 轻提示

          // ================= ## 表单组件 =================
          'calendar/index',       // Calendar 日历
          'checkbox/index',       // Checkbox 复选框
          'datetime-picker/index',// DatetimePicker 时间选择
          'field/index',          // Field 输入框
          // new v2 // NumberKeyboard 数字键盘 // new v2
          // new v2 // PasswordInput 密码输入框 // new v2
          'picker/index',         // Picker 选择器
          'radio/index',          // Radio 单选框
          'rate/index',           // Rate 评分
          'search/index',         // Search 搜索
          /**
           * 最后优化是，直接将用taro写的组件用原生重新实现。
           * 然后taro来mock一层。这个方案没试过，可以试试看看性能，
           * vant原生的实现能够用这种方式做到跟手动画、
           */
          'slider/index',         // Slider 滑块
          'stepper/index',        // Stepper 步进器
          'switch/index',         // Switch 开关 TODO 异步
          'uploader/index',       // Uploader 文件上传

          // ================= ## 反馈组件 =================
          'action-sheet/index',   // ActionSheet 动作面板
          'dialog/index',         // Dialog 弹出框
          'dropdown-menu/index',  // DropdownMenu 下拉菜单
          'loading/index',        // Loading 加载
          'notify/index',         // Notify 消息提示
          'overlay/index',        // Overlay 遮罩层
          // new v2 // PullRefresh 下拉刷新 // new v2
          'share-sheet/index',    // ShareSheet 分享面板
          'swipe-cell/index',     // SwipeCell 滑动单元格

          // ================= ## 展示组件 =================
          // Info(Badge) 徽标 // new v2 add demo
          'circle/index',         // Circle 环形进度条
          'collapse/index',       // Collapse 折叠面板
          'count-down/index',     // CountDown 倒计时
          'divider/index',        // Divider 分割线
          'empty/index',          // Empty 空状态
          // new v2 // ImagePreview 图片预览 // new v2
          // new v2 // List 列表 // new v2
          'notice-bar/index',     // NoticeBar 通知栏
          'progress/index',       // Progress 进度条
          'skeleton/index',       // Skeleton 骨架屏
          'steps/index',          // Steps 步骤条
          'sticky/index',         // Sticky 粘性布局 TODO: 现在是单独区分开weapp版本和h5版本
          // new v2 // Swipe 轮播 // new v2
          'tag/index',            // Tag 标签

          'panel/index',
          // ================= ## 导航组件 =================
          'grid/index',           // Grid 宫格
          'index-bar/index',      // IndexBar 索引栏
          'nav-bar/index',        // NavBar 导航栏
          // new v2 // Pagination 分页 // new v2
          'sidebar/index',        // Sidebar 侧边导航
          'tab/index',            // Tab 标签页 TODO
          'tabbar/index',         // Tabbar 标签栏
          'tree-select/index',    // TreeSelect 分类选择

          // ================= ## 业务组件 =================
          'goods-action/index', // TODO ActionBar 动作栏
          // new v2 // AddressEdit 地址编辑 // new v2
          // new v2 // AddressList 地址列表 // new v2
          // 'area/index',        // Area 省市区选择 TODO
          'card/index',           // Card 卡片
          // new v2 // ContactCard 联系人卡片 // new v2
          // new v2 // ContactEdit 联系人编辑 // new v2
          // new v2 // ContactList 联系人列表 // new v2
          // new v2 // Coupon 优惠券选择器 // new v2
          'submit-bar/index',   // SubmitBar 提交订单栏 TODO,


          // =============================================
          'virtual-list/index',   // SubmitBar 提交订单栏 TODO,

        ]
      }
    ]
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
