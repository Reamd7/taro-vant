import Taro from "@tarojs/taro"
export function getCurrentPage() {
  const pages = Taro.getCurrentPages(); // weapp + h5 都支持
  if (pages.length > 0) {
    return pages[pages.length - 1]
  } else {
    return null
  }
}
