# 组件
## 基础组件
- [x] Button 按钮
- [x] Cell 单元格
- [x] Icon 图标
- [x] Image 图片
- [x] Layout 布局
- [x] Popup 弹出层
- [x] Transition 动画
## 表单组件
- [*] Calendar 日历
- [x] Checkbox 复选框
- [ ] DatetimePicker 时间选择
- [-] Field 输入框
- [x] Picker 选择器
- [ ] Radio 单选框
- [x] Rate 评分
- [-] Search 搜索
- [-] Slider 滑块
- [x] Stepper 步进器
- [-] Switch 开关
- [] Uploader 文件上传
## 反馈组件
- [x] ActionSheet 上拉菜单
- [ ] Dialog 弹出框
- [ ] DropdownMenu 下拉菜单
- [x] Loading 加载
- [x] Notify 消息通知
- [x] Overlay 遮罩层
- [x] ShareSheet 分享面板
- [x] SwipeCell 滑动单元格
- [x] Toast 轻提示 ( 这个如果是默认显示的情况下 好像有点问题？)
## 展示组件
- [-] Circle 进度条 ( Canvas )
- [-] Collapse 折叠面板
    - item
- [x] CountDown 倒计时
- [x] Divider 分割线
- [x] Empty 空状态
- [x] NoticeBar 通告栏
- [x] Panel 面板
- [x] Progress 进度条
- [x] Skeleton 骨架屏
- [x] Steps 步骤条
- [ ] Sticky 粘性布局( 需要处理 页面 级别 scroll 事件 )
- [x] Tag 标记
- [ ] TreeSelect 分类选择
## 导航组件
- [x] Grid 宫格
- [ ] IndexBar 索引栏
- [ ] Sidebar 侧边导航
- [x] NavBar 导航栏
- [ ] Tab 标签页
- [-] Tabbar 标签栏
    - item
## 业务组件
- [ ] Area 省市区选择
- [ ] Card 商品卡片
- [ ] SubmitBar 提交订单栏
- [ ] GoodsAction 商品导航


## NOTE：
1、自定义组件-> 如果在自定义组件使用的时候，传递的了data-xxx 的属性。
但是自定义组件提供的事件都是绑定在原生的组件上的，所以那些事件就取不到传递进自定义组件的data值，
所以需要对事件进行包装

之前没有意识到这个问题，所以就没有处理，在Rate的Demo中发现这个问题了，这是所有自定义组件都需要的一个吧。

上面的理解是错的，因为没有把这个理解为React的组件，
对于react自定义组件来说，是没有dataset的，只有props
如果使用内置组件View 等价于 div，自然也有dataset，但是注意一点，dataset在HTML中是`readonly Record<string, string>`。而在小程序不是。

1、自定义组件不可以传递我没有支持的props。包括data-xxx。
2、非自定义组件（原生组件、内置组件），可以支持data-xxx（也是HTML，Weapp，如果需要使用RN，就不支持了）

2、不太能够搞得清楚getRect / getAllRect 为什么不能处理自定义组件（slot）内class，如果需要用到这个api
还是需要针对对应的自定义组件外层加一个View

3、问题来了，这样封装会导致组件多一层就多几个State变量。这样太不优雅了
