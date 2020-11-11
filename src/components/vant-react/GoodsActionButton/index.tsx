import Taro from "@tarojs/taro"

import "./index.less";
import VanButton, { VanButtonProps } from "../Button";
import { MixinLinkProps, useLink } from "../common/mixins/link";
import { useMemoBem } from "../common/utils";
import { View } from "@tarojs/components";

export type VanGoodsActionButtonProps = Pick<VanButtonProps,
  "id" |
  "lang" |
  "type" |
  "color" |
  "plain" |
  "loading" |
  "disabled" |
  "openType" |
  "sessionFrom" |
  "appParameter" |
  "sendMessageImg" |
  "sendMessagePath" |
  "showMessageCard" |
  "sendMessageTitle" |
  "onClick" |
  "onError" |
  "onContact" |
  "onOpenSetting" |
  "onGetUserInfo" |
  "onGetPhoneNumber" |
  "onLaunchapp"
> & MixinLinkProps & {
  text?: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const VanGoodsActionButton: Taro.FunctionComponent<VanGoodsActionButtonProps> = (props) => {
  const {
    isFirst, isLast, text, type, plain
  } = props;
  const bem = useMemoBem();
  const jumpLink = useLink(props);

  return <View className={bem('goods-action-button', [type, { first: isFirst, last: isLast, plain: plain }])}>
    <VanButton
      id={props.id}
      lang={props.lang}
      type={props.type}
      color={props.color}
      plain={props.plain}
      loading={props.loading}
      disabled={props.disabled}
      openType={props.openType}
      custom-class="van-goods-action-button__inner"
      className="van-goods-action-button__inner"
      // business-id={props.businessId}
      sessionFrom={props.sessionFrom}
      app-parameter={props.appParameter}
      send-message-img={props.sendMessageImg}
      send-message-path={props.sendMessagePath}
      show-message-card={props.showMessageCard}
      send-message-title={props.sendMessageTitle}
      onClick={(e) => {
        props.onClick && props.onClick(e)
        jumpLink()
      }}
      onError={props.onError}
      onContact={props.onContact}
      onOpenSetting={props.onOpenSetting}
      onGetUserInfo={props.onGetUserInfo}
      onGetPhoneNumber={props.onGetPhoneNumber}
      onLaunchapp={props.onLaunchapp}
    >
      {text}
    </VanButton>
    {props.children}
  </View>
}

VanGoodsActionButton.defaultProps = {
  type: "danger"
}
VanGoodsActionButton.options = {
  addGlobalClass: true
}

export default VanGoodsActionButton
