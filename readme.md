### 兼容中遇见的问题

1. h5不支持 :host，需要单独处理每一个组件wrapper的样式
2. h5 中 style 一开始是 { color: "red" } 就不能动态改为 undefined
3. nerv/src/render-queue.ts => 就是这个原因 pop ，所以更新的时候是逆序更新的，但是mount的时候是顺序挂载的。
4. 使用 canvas api，因为h5不支持 Taro.createSelectorQuery()不支持node，取不到canvas 对象，最后使用dom方式来找到
5. useScope在函数式组件的不支持，不能使用 这种方式进行，兼容实现了 useScopeRef，挂载在 wrapper 中ref
6. animation api 不知道怎么使用，weapp的使用方式不能支持在h5上。（现在是使用多端组件兼容的方式来做的）
7. 使用了touchmove的组件，注意要在 touchstart 中 preventDefault，h5中会移动页面。
