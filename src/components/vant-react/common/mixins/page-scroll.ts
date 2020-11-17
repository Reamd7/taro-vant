import { getCurrentPage } from "../utils";
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

const usePageScrollMixin = (scroller: ScrollerFunc) => {
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
    }

    return function () {
      const page = getCurrentPage();
      if (page) {
        page.vanPageScroller = (page.vanPageScroller || []).filter(
          (item) => item !== scroller
        );
      }
    }
  }, [page])
}


export default usePageScrollMixin
