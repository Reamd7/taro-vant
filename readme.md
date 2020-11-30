### 兼容中遇见的问题

1. h5不支持 :host，需要单独处理每一个组件wrapper的样式
2. h5 中 style 一开始是 { color: "red" } 就不能动态改为 undefined
3. nerv/src/render-queue.ts => 就是这个原因 pop ，所以更新的时候是逆序更新的，但是mount的时候是顺序挂载的。
4. 使用 canvas api，因为h5不支持 Taro.createSelectorQuery()不支持node，取不到canvas 对象，最后使用dom方式来找到
5. useScope在函数式组件的不支持，不能使用 这种方式进行，兼容实现了 useScopeRef，挂载在 wrapper 中ref
6. animation api 不知道怎么使用，weapp的使用方式不能支持在h5上。（现在是使用多端组件兼容的方式来做的）
7. 使用了touchmove的组件，注意要在 touchstart 中 preventDefault，h5中会移动页面。
8. 获取当前路由路径, 需要进行兼容处理
```js
if (process.env.TARO_ENV === "h5") {
    return page.$router.path // TODO 坑
}
return page.route
```
9. taro 图片样式错误
```css
.taro-img__mode-scaletofill {
    /** object-fit: contain; */
    object-fit: fill;
    width: 100%;
    height: 100%;
}
.taro-img__mode-aspectfit {
    object-fit: contain;
    width: 100%;
    height: 100%;
}
```

10. 处理h5中 navigate
- 绕过了修改代理taro navigate的能力，直接hack，用MutationObserver监听taro_router的变动。
11. 处理文件上传控件（这个肯定需要单独出来制作一个组件，需要注意的是，不同小程序平台对于文件选择都有不同的情况）

12. picker 组件的问题：
    - 支付宝小程序和微信小程序的实现是不一样的。
    支付宝小程序修改columns的时候，是不会触发onChange
    微信小程序修改columns时候，会触发onChange

    - 微信小程序 indicatorStyle 这个组件不支持rpx

    - 支付宝小程序 模拟器中切换了机型，dpr不变 my.getSystemInfoSync().pixelRatio 总是 2
### TODO

- toast 可能还有未知的问题。
- h5 图片的问题，
