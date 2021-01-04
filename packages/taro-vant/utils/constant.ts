import Taro from '@tarojs/taro';
export const isH5 = process.env.TARO_ENV === "h5";
export const isWeapp = process.env.TARO_ENV === "weapp"
export const isAlipay = process.env.TARO_ENV === "alipay" // 不支持scope的能力，需要处理。
export const isExternalClass = isWeapp;
export const isNormalClass = isH5 || process.env.TARO_ENV === "alipay";
export const noop = () => { }

let systemInfo: Taro.getSystemInfoSync.Result | null = null;
export function getSystemInfoSync() {
  if (systemInfo == null) {
    systemInfo = Taro.getSystemInfoSync();
  }
  return systemInfo;
}
