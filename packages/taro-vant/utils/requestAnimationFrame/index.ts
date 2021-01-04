import { isH5 } from "../constant";

const __requestAnimationFrame__ = function (fn: (...args: any[]) => any) {
  // const el = Taro
  //   .createSelectorQuery()
  //   .selectViewport()
  //   .boundingClientRect();
  // console.log(performance.now())
  // if (Info.platform === 'devtools') {
  //   return nextTick(cb);
  // }
  // return el.exec(() => {
  //   fn();
  // });
  return setTimeout(fn, 1000 / 30);
};
export const requestAnimationFrame = function (fn: (...args: any[]) => any) {
  if (isH5) {
    return window.requestAnimationFrame(fn) || __requestAnimationFrame__(fn)
  } else {
    return __requestAnimationFrame__(fn)
  }
};

export const cancelAnimationFrame = function (id: ReturnType<typeof requestAnimationFrame>) {
  if (isH5) {
    window.cancelAnimationFrame ? window.cancelAnimationFrame(id) : clearTimeout(id);
  } else {
    clearTimeout(id);
  }
}
