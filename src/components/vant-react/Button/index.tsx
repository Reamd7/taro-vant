import { Block, Button, View, Text } from "@tarojs/components";
import Taro, { useEffect, useState } from "@tarojs/taro";
import {
  noop,
  useMemoBem,
  useMemoClassNames,
  useMemoCssProperties
} from "../common/utils";
import VanIcon from "../icon";
import VanLoading from "../loading";
import type { LoadingType } from '../loading'
import "./index.less";

type ButtonType = "default" | "primary" | "info" | "warning" | "danger";
type ButtonSize = "large" | "normal" | "small" | "mini";
type SourceBtnProps = React.ComponentProps<typeof Button>;

export type ButtonProps = {
  plain?: boolean;
  block?: boolean;
  round?: boolean;
  square?: boolean;
  loading?: boolean;
  loadingText?: string;
  loadingType?: LoadingType;
  hairline?: boolean;
  size?: ButtonSize;
  loadingSize?: string;
  color?: string;
  type?: ButtonType;

  // nativeType?: SourceBtnProps['type'];
  // iconPosition?: "left" | "right";
  icon?: string;
  IconClassPrefix?: string;

  text?: string;
  dataset?: any;

  formType?: SourceBtnProps['formType'];

  className?: string;
  hoverClass?: string;
  loadingClass?: string;

  style?: React.CSSProperties;
};
export type ButtonEvents = {
  onClick?: SourceBtnProps["onClick"];
};
// ==================================
export type MixinsButtonProps = Pick<
  SourceBtnProps,
  | "id"
  | "lang"
  | "sessionFrom"
  | "sendMessageTitle"
  | "sendMessagePath"
  | "sendMessageImg"
  | "showMessageCard"
  | "appParameter"
  | "disabled"
  | "hoverClass"
>;
// ==================================
export type MixinsOpenTypeProps = Pick<SourceBtnProps, "openType">;
export type MixinsOpenTypeEvents = Pick<
  SourceBtnProps,
  | "onGetUserInfo"
  | "onContact"
  | "onGetPhoneNumber"
  | "onError"
  | "onLaunchapp"
  | "onOpenSetting"
>;
// ==================================

const loadingColor = (type: string, color?: string, plain?: boolean) => {
  if (plain) {
    return color ? color : "#c9c9c9";
  }

  if (type === "default") {
    return "#c9c9c9";
  }
  return "white";
}
const VanButton: Taro.FunctionComponent<ButtonProps &
  ButtonEvents &
  MixinsButtonProps &
  MixinsOpenTypeProps &
  MixinsOpenTypeEvents
> = (props) => {
  const classnames = useMemoClassNames();
  const bem = useMemoBem();
  const css = useMemoCssProperties();

  const {
    type = 'default',
    size = 'normal',
    block,
    round,
    plain,
    square,
    loading,
    loadingSize = '20px',
    disabled,
    hairline,
    color,
    IconClassPrefix = 'van-icon',
    loadingType = 'circular',
    dataset = null
  } = props;

  const [baseStyle, setBaseStyle] = useState({});

  useEffect(()=>{
    setBaseStyle(css({
      color: plain ? color : 'white',
      background: plain ? undefined : color,
      border: (color && color.indexOf('gradient') !== -1) ? 0 : undefined,
      borderColor: (color && color.indexOf('gradient') !== -1) ? undefined : color
    }))
  }, [color, css, plain])

  return (
    <Button
      id={props.id}
      data-detail={dataset}
      className={classnames(
        props.className,
        bem("button", [
          type,
          size,
          {
            block,
            round,
            plain,
            square,
            loading,
            disabled,
            hairline,
            unclickable: disabled || loading,
          },
        ]),
        hairline && "van-hairline--surround"
      )}
      hoverClass={classnames("van-button--active", props.hoverClass)}
      lang={props.lang}
      formType={props.formType}
      style={css({
        ...baseStyle,
        ...props.style,
      })}
      openType={disabled ? undefined : props.openType}
      sessionFrom={props.sessionFrom}
      sendMessageImg={props.sendMessageImg}
      sendMessagePath={props.sendMessagePath}
      sendMessageTitle={props.sendMessageTitle}
      showMessageCard={props.showMessageCard}
      appParameter={props.appParameter}
      onClick={(!disabled && !loading) ? props.onClick : noop}
      onGetUserInfo={props.onGetUserInfo}
      onContact={props.onContact}
      onGetPhoneNumber={props.onGetPhoneNumber}
      onError={props.onError}
      onLaunchapp={props.onLaunchapp}
      onOpenSetting={props.onOpenSetting}
    >
      {loading ? (
        <Block>
          <VanLoading
            className={props.loadingClass}
            size={loadingSize}
            type={loadingType}
            color={loadingColor(type, props.color, plain)}
          />
          {props.loadingText && (
            <View className='van-button__loading-text'>
              <Text>{props.loadingText}</Text>
            </View>
          )}
        </Block>
      ) : (
        <Block>
          {props.icon && (
            <VanIcon
              size='1.2em'
              name={props.icon}
              classPrefix={IconClassPrefix}
              className='van-button__icon'
              customStyle={{
                lineHeight: "inherit",
              }}
            />
          )}
          <View className='van-button__text'>{props.children}</View>
        </Block>
      )}
    </Button>
  );
};
VanButton.options = {
  addGlobalClass: true,
};

export default VanButton;
