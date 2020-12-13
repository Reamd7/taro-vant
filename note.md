
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

### 兼容中遇见的问题

1. [x] h5不支持 :host，需要单独处理每一个组件wrapper的样式
2. [x] h5 中 style 一开始是 { color: "red" } 就不能动态改为 undefined
3. [x] <del>nerv/src/render-queue.ts => 就是这个原因 pop ，所以更新的时候是逆序更新的，但是mount的时候是顺序挂载的。</del>（relation中的实现只必须依赖total了，所以如果更新顺序不一致我都能根据内部的count判断是否更新完成，所以顺序已经不重要了）
```typescript
// nerv/src/render-queue.ts
// 就是这个原因 pop ，所以更新的时候是逆序更新的，但是mount的时候是顺序挂载的。
// NOTE : 这个如果要迁移到react中需要进行测试。
function rerender(isForce) {
    if (isForce === void 0) isForce = false;

    var p;
    var list = items;
    items = [];
    // tslint:disable-next-line:no-conditional-assignment
    while (p = list.pop()) { // 因为这里的原因，所以这里更新是逆序的。
        if (p._dirty) {
            updateComponent(p, isForce);
        }
    }
}
```

4. [x] <del>使用 canvas api，因为h5不支持 Taro.createSelectorQuery()不支持node，取不到canvas 对象，最后使用dom方式来找到</del>（证实是自己的问题，需要canvas中定义了type）
5. [] animation api 不知道怎么使用，weapp的使用方式不能支持在h5上。（现在是使用多端组件兼容的方式来做的）
6. [x] 使用了touchmove的组件，注意要在 touchstart 中 preventDefault，h5中会移动页面。———— edge浏览器的问题
7. [x] 获取当前路由路径, 需要进行兼容处理
```js
if (process.env.TARO_ENV === "h5") {
    return page.$router.path // TODO 坑
}
return page.route
```
8. [x] taro 图片样式错误
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

9. [x] 处理h5中 navigate
- 绕过了修改代理taro navigate的能力，直接hack，用MutationObserver监听taro_router的变动。
10. [x] 处理文件上传控件（这个肯定需要单独出来制作一个组件，需要注意的是，不同小程序平台对于文件选择都有不同的情况）

11. [x] picker 组件的问题：
    - 支付宝小程序和微信小程序的实现是不一样的。
    支付宝小程序修改columns的时候，是不会触发onChange
    微信小程序修改columns时候，会触发onChange

    - 微信小程序 indicatorStyle 这个组件不支持rpx
    - 支付宝小程序 模拟器中切换了机型，dpr不变 my.getSystemInfoSync().pixelRatio 总是 2


12. [ ] toast 可能还有未知的问题。
13. [ ] h5 图片的问题，

14. scope 的批量问题
    - [x] useScope在函数式组件的不支持，不能使用 这种方式进行，兼容实现了 useScopeRef，挂载在 wrapper 中ref
    - [x] 组件初始化时唯一初始化一个id挂载在wrapper中，便于查dom（暂时没有独立的hook）
        ```typescript
        const id = useMemo(()=> `ComponentId_${Math.random().toString().split('.')[1]}`, [])
        ```
    - [x] 支付宝小程序不支持所有api中的scope参数。
        - [x] SelectQuery 但是在最新的支付宝api中已经有了in scope的支持了。scope是自定义组件。
    - [x] Calendar 组件中测试兼容了 createIntersectionObserver
        - h5 需要单独实现
        - 支付宝小程序中不支持scope，所以不能使用Taro.createIntersectionObserver，会报错
          - 支付宝小程序中使用的是 selectAll 而不是 observeAll 参数。

15. [ ] 内置组件ScrollView H5版本：
- h5 的问题
  - document.querySelector(`#${id}`).scrollIntoView 的滚动是有问题的，不能支持 smooth（速度太慢了）
- h5 中的实现中 scrollTop ，scrollLeft，其实是一个受控属性的实现，但是对于小程序中，这些属性都不是受控属性的实现。（逻辑上是有问题的）
- index list 组件，有一个问题：h5端中移动端（chrome浏览器滚动很慢（Chrome87），QQ内置爆炸，微信爆炸，但是pc端edge（Chrome87）没问题，夸克浏览器没问题）


16. [ ] animation的问题：
    - 支付宝小程序中，animation注入的函数不能挂载style？不能动态修改style
    - h5中，animation属性和data-animation属性都要加（遇见step的情况，关键帧动画，就一定要加，因为 taro/h5 的实现有问题。）
    -
---------------------------------------------
标注：
import \{(.*)\} from '@tarojs/taro' \/\*\* api \*\*\/
const {$1} = Taro /** api **/;


throttle-debounce
big.js
dayjs
classNames
