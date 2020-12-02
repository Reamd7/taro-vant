import { getCurrentPage, isH5 } from "../utils";
import { PageScrollObject, useEffect } from "@tarojs/taro";

export type ScrollerFunc = (obj: PageScrollObject) => any
export type Scroller = Taro.PageScrollObject;

function onPageScroll(event?: Scroller) {
  const page = getCurrentPage() as any;

  if (page) {
    page.vanPageScroller.forEach((scroller: ScrollerFunc) => {
      if (typeof scroller === 'function') {
        // @ts-ignore
        scroller(event);
      }
    });
  }
}

const usePageScrollMixin = (scroller: ScrollerFunc, disabled: boolean = false) => {
  const page = getCurrentPage() as any;
  useEffect(() => {
    if (page) {
      const vanPageScroller: ScrollerFunc[] | null = page.vanPageScroller;

      if (Array.isArray(vanPageScroller)) {
        vanPageScroller.push(scroller);
      } else {
        page.vanPageScroller = typeof page.onPageScroll === 'function' ? [page.onPageScroll.bind(page), scroller]
          : [scroller];
      }
      page.onPageScroll = onPageScroll;


      if (isH5) {
        document.querySelectorAll(".taro_page").forEach((v: HTMLDivElement)=> {
          v.style.display !== "none" && (v.onscroll = page.onPageScroll)
        })
      }
    }

    return function () {
      const page = getCurrentPage();
      if (page) {
        page.vanPageScroller = (page.vanPageScroller || []).filter(
          (item) => item !== scroller
        );
      }
      if (isH5) {
        document.querySelectorAll(".taro_page").forEach((v: HTMLDivElement)=> {
          v.style.display === "none" && (v.onscroll = null)
        })
      }
    }
  }, [page, disabled])
}


export default usePageScrollMixin
