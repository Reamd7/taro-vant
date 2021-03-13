import Taro from "@tarojs/taro";

import "./index.less";
import VanButton, { VanButtonProps } from "../Button";
import VanIcon, { VanIconProps } from "../icon";
import { MixinLinkProps, useLink } from "../common/mixins/link";
import { Text } from "@tarojs/components";
import { useMemoClassNames, isExternalClass, isNormalClass } from "../utils"

export type VanGoodsActionIconProps = {
  'icon-class'?: string;
  iconClass?: string;
  'text-class'?: string;
  textClass?: string;
  'custom-class'?: string;
  className?: string;
} & Pick<VanButtonProps, "id" | "lang" | "loading" | "disabled" | "openType" | "sessionFrom" | "appParameter" | "sendMessageImg" | "sendMessagePath" | "showMessageCard" | "sendMessageTitle" | "onClick" | "onError" | "onContact" | "onOpenSetting" | "onGetUserInfo" | "onGetPhoneNumber" | "onLaunchapp"> & Pick<VanIconProps, "dot" | "info"> & {
  icon?: VanIconProps['name'];
  renderIcon?: React.ReactNode

  text?: string
} & MixinLinkProps

const VanGoodsActionIcon: Taro.FunctionComponent<VanGoodsActionIconProps> = (props) => {
  const jumpLink = useLink(props);
  const classnames = useMemoClassNames();

  const { text } = props;

  return <VanButton
    square
    id={props.id}
    size="large"
    lang={props.lang}
    loading={props.loading}
    disabled={props.disabled}
    openType={props.openType}
    custom-class="van-goods-action-icon"
    className="van-goods-action-icon"
    sessionFrom={props.sessionFrom}
    appParameter={props.appParameter}
    sendMessageImg={props.sendMessageImg}
    sendMessagePath={props.sendMessagePath}
    showMessageCard={props.showMessageCard}
    sendMessageTitle={props.sendMessageTitle}
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
    renderIcon={props.icon ?
      <VanIcon
        name={props.icon}
        dot={props.dot}
        info={props.info}
        custom-class={"icon-class van-goods-action-icon__icon"}
        className={
          classnames(
            props.iconClass,
            "van-goods-action-icon__icon"
          )}
      /> : props.renderIcon}
  >
    <Text className={
      classnames(
        isExternalClass && "text-class",
        isNormalClass && props.textClass
      )
    }>{text}</Text>
  </VanButton>
}
VanGoodsActionIcon.options = {
  addGlobalClass: true
}
VanGoodsActionIcon.externalClasses = [
  'icon-class',
  'text-class',
  'custom-class'
]
export default VanGoodsActionIcon
