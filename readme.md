# taro-vant

基于taro2进行多端组件开发，迁移vant-weapp的组件库，兼容h5、微信小程序端、支付宝小程序端。

## 安装

`npm i taro-vant`

`yarn add taro-vant`

### 使用前 需要配置
> 因为我希望这个组件是可以用小程序原生组件混合编写的，但是原有的taro build -ui生成出来的组件是不行的（我看taro-ui的编译配置方式，测试配置之后结果），
>
> 所以研究了几天弄了一个taro的配置和插件，使得原有的组件和自己项目写的代码一样进行编译。
>
> 至于为什么使用.temp 文件夹，是因为taro的临时文件夹名称也是.temp，所以这个一般都会写入 .gitignore，而这个文件夹应该是不需要添加到版本管理中的。
>
> NOTE: 小程序中，修改了webpack配置 `resolve.symlinks: false` , 不知道这个是否会影响
```js
// config/index.js中最后一部分
module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({},
      config, require('./dev'),
      require('taro-vant/src/components/taro-vant/plugin')({
        tempPath: "components/.temp", // 在src下的临时文件路径，必须是相对路径 src/components/.temp
        modules: {
          // "taro-vant": "src/components/taro-vant" // node_module/taro-vant/src/components/taro-vant, // 兼容各种类型的node模块，我是从npm 安装 git 模块中的需求中发现这个需求的
          "taro-vant": "" // node_module/taro-vant
          // "taro-vant": "." // node_module/taro-vant

        }, // 需要inline编译的library => 模块的根目录
        copySrcWxs: false // 内联一个功能，是否复制src项目编写的wxs文件
      })
    )
  }
  return merge({},
    config, require('./prod'),
    require('taro-vant/src/components/taro-vant/plugin')({
      tempPath: "components/.temp",
      modules: {
        // "taro-vant": "src/components/taro-vant" // node_module/taro-vant/src/components/taro-vant
        "taro-vant": "" // node_module/taro-vant
        // "taro-vant": "." // node_module/taro-vant
      },
      copySrcWxs: false
    })
  )
}
```

## 为什么选择 taro2，而不是最新的taro3

> 为了taro到小程序端的能力，还是使用taro2的编译方向来保证这些低性能的小程序。
    > 也方便直接写多端组件。

> 不愿意为了开发体验，牺牲性能，没有性能没得作。。
>
> 同时，这也基本使用了 hooks 进行开发，
>
> 使用的api也基本封装在utils中。
>
> 迁移到taro3的组件实现成本也不会太高
>
> 2020.12.15 ：taro3 h5 一堆问题，迁移了有些炸有些不炸，主要还是炸。暂时不处理。

### 如何解决开发体验的问题

1. `React.children.map` （最主要）
    > 内置实现了一个useRelationListen / useRelationInject 的hook

2. 以及保证判断 `props.children` 是否存在的问题
    > props中使用 `useSlot` 之类的属性判断

## 组件

### 基础组件
- [x] Button 按钮
- [x] Cell 单元格
- [x] Icon 图标
- [x] Image 图片
- [x] Layout 布局
- [x] Popup 弹出层
- [x] Transition 动画
### 表单组件
- [x] Calendar 日历
- [x] Checkbox 复选框
- [x] DatetimePicker 时间选择
- [x] Field 输入框
- [x] Picker 选择器
- [x] Radio 单选框
- [x] Rate 评分
- [x] Search 搜索
- [x] Slider 滑块
- [x] Stepper 步进器
- [x] Switch 开关
- [x] Uploader 文件上传
### 反馈组件
- [x] ActionSheet 上拉菜单
- [x] Dialog 弹出框
- [x] DropdownMenu 下拉菜单
- [x] Loading 加载
- [x] Notify 消息通知
- [x] Overlay 遮罩层
- [x] ShareSheet 分享面板
- [x] SwipeCell 滑动单元格
- [x] Toast 轻提示 ( 这个如果是默认显示的情况下 好像有点问题？)
### 展示组件
- [x] Circle 进度条 ( Canvas )
- [x] Collapse 折叠面板
    - item
- [x] CountDown 倒计时
- [x] Divider 分割线
- [x] Empty 空状态
- [x] NoticeBar 通告栏
- [x] Panel 面板
- [x] Progress 进度条
- [x] Skeleton 骨架屏
- [x] Steps 步骤条
- [x] Sticky 粘性布局( 需要处理 页面 级别 scroll 事件 )
- [x] Tag 标记
- [x] TreeSelect 分类选择
### 导航组件
- [x] Grid 宫格
- [x] IndexBar 索引栏
- [x] Sidebar 侧边导航
- [x] NavBar 导航栏
- [x] Tab 标签页
- [x] Tabbar 标签栏
    - item
### 业务组件
- [ ] Area 省市区选择（暂时用taro内置的功能替代）
- [x] Card 商品卡片
- [x] SubmitBar 提交订单栏
- [x] GoodsAction 商品导航

### 其他组件
- [-] 虚拟列表
  - [ ] 下拉刷新

## 未来计划

### 增加组件
  - 对标framework7的组件类型。

### 将组件迁移到 react-native
  - 开一个新项目来编写react-native的component

### 完善动画能力
  - 触摸、跟手交互动画
  - animation 的处理

### shim抹平taro的多端问题
- taro有很多多端兼容的问题，因为开发模式的不一样

- [x] 优化 plugin 实现，观察源码，可以注入onReady hook事件，替换原有实现。
- [ ] 编写babel编译插件，支持驼峰 externalClass
