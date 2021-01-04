/// <reference path="../node_modules/miniprogram-api-typings/index.d.ts" />
interface IAppOption {
  globalData: {
    userInfo?: WechatMiniprogram.UserInfo,
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback,
}

interface WxsProps<T> extends React.HTMLAttributes<T> {
  module: string;
  src: string;
}

declare namespace JSX {
  interface IntrinsicElements {
    wxs: React.DetailedHTMLProps<WxsProps<HTMLScriptElement>, HTMLScriptElement>;
  }
}

