import Nerv from "nervjs";
import Taro from "@tarojs/taro";
import { useMemo } from "react"
import VanNavBar from "src/components/vant-react/NavBar";
import "./mocknative.less"
import { getCurrentPage } from "src/components/vant-react/common/utils";
import BehaviorSubject, { useListenerBehaviorSubject } from "../BehaviorSubject";

const routerListener = new BehaviorSubject<Taro.Page | null>(null)

function MockNav() {
  const router = useListenerBehaviorSubject(routerListener)
  const page = useMemo(() => {
    return router ? {
      ...router.$app.config.window,
      ...router.config,
    } : {}
  }, [router])

  // useEffect(() => {
  //   routerListener.next(getCurrentPage())
  // }, [])

  // useEffect(() => {
  //   const page = getCurrentPage();
  //   if (page) {
  //     const options = {
  //       ...page.$app.config.window,
  //       ...page.config,
  //     }
  //     console.log(options.navigationBarTitleText)
  //     setPage(options)
  //   }

  //   window.addEventListener("hashchange", function () {
  //     console.log("location: " + document.location);
  //     const page = getCurrentPage();
  //     if (page) {
  //       const options = {
  //         ...page.$app.config.window,
  //         ...page.config,
  //       }
  //       setPage(options)
  //     }
  //   })
  //   window.addEventListener('popstate', (event) => {
  //     console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
  //   });
  // }, [])
  return router ? <VanNavBar
    title={page.navigationBarTitleText}
    leftArrow={true}
    onClickLeft={() => Taro.navigateBack()}
  ></VanNavBar> : null
}

// const navigateBack = Taro.navigateBack.bind({}) as typeof Taro.navigateBack;
const navigateTo = Taro.navigateTo.bind({}) as typeof Taro.navigateTo;
// const reLaunch = Taro.reLaunch.bind({}) as typeof Taro.reLaunch;
// const redirectTo = Taro.redirectTo.bind({}) as typeof Taro.redirectTo;
// Taro.navigateBack = function (options) {
//   console.log(options)
//   console.log(getCurrentPage())

//   return navigateBack(options).then(value => {
//     return value
//   })
// }
let scrollTop = 0;
Taro.navigateTo = function (options) {
  console.log(options)
  const page = getCurrentPage();
  if (page) {
    scrollTop = ((page as any)._rendered.dom as HTMLElement).parentElement!.parentElement!.scrollTop
  }
  return navigateTo(options).then(value => {
    return value
  })
}
// Taro.reLaunch = function (options) {
//   console.log(options)
//   return reLaunch(options).then(value => {
//     return value
//   })
// }
// Taro.redirectTo = function (options) {
//   console.log(options)
//   return redirectTo(options).then(value => {
//     return value
//   })
// }


window.addEventListener("load", function () {
  routerListener.next(getCurrentPage())

  const app = document.getElementById("app");
  app!.style.display = "flex"
  const navcontainer = document.createElement("div");
  navcontainer.id = "app_nav"
  app!.insertAdjacentElement('afterbegin', navcontainer)

  // Firefox和Chrome早期版本中带有前缀
  var MutationObserver = window.MutationObserver
  // 选择目标节点
  var target = document.querySelector('.taro_router') as HTMLDivElement;
  // 创建观察者对象
  var navTop = 0
  var observer = new MutationObserver(function (mutations) {
    routerListener.next(getCurrentPage())

    // TODO 在之后看看怎么增加过度效果。改变 transition
    // console.log(mutations)
    // transform: translate(100%, 0);
    // transition: transform ease-in-out 0.6s;
    // ontransitionend

    // ================================
    navTop = navTop ? navTop : navcontainer.offsetTop + navcontainer.offsetHeight // NOTE 一般来说这个navbar是不会改变高度的

    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach((val: Node) => {
        if (val instanceof HTMLDivElement) {
          // let hiddenList: HTMLDivElement[] = []
          // target.childNodes.forEach(v => {
          //   if (v instanceof HTMLDivElement && v !== val) {
          //     hiddenList.push(v);
          //     v.style.display = "block"; // 先回显。再隐藏
          //   }
          // });
          val.dataset.prevOffestTop = "" + scrollTop

          // 模拟背景色
          let cs = window.getComputedStyle(val.firstElementChild!, null);
          target!.style.background = cs.background

          val.style.position = "fixed";
          val.style.top = navTop + "px";
          val.style.left = "0px";
          val.style.width = "100vw";
          val.style.height = `calc(100vh - ${navTop}px)`;
          val.style.opacity = "0"
          val.style.zIndex = "1";
          val.style.overflow = "hidden"
          val.style.touchAction = "none";
          val.style.pointerEvents = "none"

          val.style.opacity = "0"
          val.style.transform = "translate(100%, 0)";

          function ontransitionend() {
            if (val instanceof HTMLDivElement) {
              val.style.position = ""
              val.style.top = "";
              val.style.left = "";
              val.style.width = "";
              val.style.height = "";
              val.style.zIndex = "";
              val.style.overflow = "";
              val.style.touchAction = "";
              val.style.pointerEvents = ""
              val.style.opacity = ""

              val.style.transition = "";
              // val.ontransitionend = null;
              val.removeEventListener("transitionend", ontransitionend)
              // =================================
              // hiddenList.forEach(v => v.style.display = "none")
              // hiddenList = []
            }
          }
          val.addEventListener("transitionend", ontransitionend)

          setTimeout(() => {
            val.style.transform = "";
            val.style.opacity = "1"

            val.style.transitionProperty = "transform, opacity"
            val.style.transitionDuration = "400ms";
            val.style.transitionTimingFunction = "ease-in"
          }, 0)
        }
      })

      mutation.removedNodes.forEach((val: HTMLDivElement) => {
        if (val instanceof HTMLDivElement) {
          val.style.position = "fixed";
          val.style.top = navTop + "px";
          val.style.left = "0px";
          val.style.width = "100vw";
          val.style.height = `calc(100vh - ${navTop}px)`;
          val.style.transform = "translate(0, 0)";
          val.style.opacity = "1"
          val.style.zIndex = "1";
          val.style.overflow = "hidden"
          val.style.touchAction = "none";
          val.style.pointerEvents = "none"

          scrollTop = val.dataset.prevOffestTop ? Number(val.dataset.prevOffestTop) : 0
          target.scrollTo({
            top: scrollTop
          })

          val = document.body.appendChild(val) as HTMLDivElement;
          setTimeout(() => {
            val.style.opacity = "0"
            val.style.transform = "translate(100%, 0)";

            val.style.transitionProperty = "transform, opacity"
            val.style.transitionDuration = "400ms";
            val.style.transitionTimingFunction = "ease-out"
          }, 10)

          function ontransitionend() {
            if (val instanceof HTMLDivElement) {
              document.body.removeChild(val);
              val.style.transition = "";
              val.removeEventListener("transitionend", ontransitionend)
            }
          }
          val.addEventListener("transitionend", ontransitionend)
          // setTimeout(()=>{
          //   val.remove();
          // }, 400)
        }
      })
    })

    // mutations.forEach(function (mutation) {
    //   console.log(mutation.type);
    // });
  });
  // 配置观察选项:
  // 传入目标节点和观察选项
  observer.observe(target!, {
    childList: true
  });


  Nerv.render(
    <MockNav />, navcontainer
  )
})
