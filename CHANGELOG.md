## [1.0.8.alpha.0] (2021-01-05)
- 抽离externalClass plugin到另外的项目中去

- 将项目结构重构为lerna管理的 monorepo 结构，基本分离完成依赖。

## [1.0.7] (2020-12-30)

### Support Feature

- 支持驼峰 externalClass 不再需要些hover-class，直接使用 hoverClass
  > 现在只是支持如下类型的唯一语法
  >
  > ```tsx
  > VanCompoentName.externalClass = [""];
  >
  > export default VanCompoentName
  > ```
  >
  > 所以因此妥协：taro-vant 组件编写的时候暂时不能使用 externalClass = 其他标识符的语法。
  >
  > 注意因为，需要支持typescript的解析，所以直接用了babel7。（之后有闲我就把 taro 2.x 支持到 babel7）
  >
  > 暂时还只是支持 直接引用，不支持原来 index.tsx 中类似的重新导出。还要进一步处理。
  >
  >（所以原有使用`import { VanButton } from "taro-vant"`）这种引用还不支持，
  >
  > 现在只是支持`import VanButton from "taro-vant/Button"` 这种直接引用的。

## [1.0.6] (2020-12-18)

### Bug Fixes

- 修复 Skeleton 组件 externalClass 无效的问题


## [1.0.4] (2020-12-18)

### Bug Fixes

- **accordion:** 修复了无法直接npm下载使用的情况

### 功能增加
- 增加了一个 taro-vant/plugin
  - 允许未编译 taro 代码 直接编译
  - 允许复制 src/**/*.wxs 的 复制到 utput文件夹中

> 因为我希望这个组件是可以用小程序原生组件混合编写的，但是原有的taro build -ui生成出来的组件是不行的（我看taro-ui的编译配置方式，测试配置之后结果），
>
> 所以研究了几天弄了一个taro的配置和插件，使得原有的组件和自己项目写的代码一样进行编译。
>
> 至于为什么使用.temp 文件夹，是因为taro的临时文件夹名称也是.temp，所以这个一般都会写入 .gitignore，而这个文件夹应该是不需要添加到版本管理中的。

```js
// config/index.js中最后一部分
module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({},
      config, require('./dev'),
      require('taro-vant/plugin')({
        tempPath: "components/.temp", // 在 src 下的临时文件路径，必须是相对路径 如 components/.temp => src/components/.temp
        modules: ["taro-vant"], // 需要 内联编译的library
        copySrcWxs: false // 内联一个功能，是否复制src项目编写的wxs文件
      })
    )
  }
  return merge({},
      config, require('./prod'),
      require('taro-vant/plugin')({
        tempPath: "components/.temp",
        modules: ["taro-vant"],
        copySrcWxs: false
      })
    )
}
```

