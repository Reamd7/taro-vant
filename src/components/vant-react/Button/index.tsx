import { Block, Button, View, Text } from "@tarojs/components";
import Taro, { useEffect, useState } from "@tarojs/taro";
import {
  noop,
  useMemoBem,
  useMemoClassNames,
  useMemoCssProperties,
  isH5,
  isWeapp
} from "../common/utils";
import VanIcon from "../icon";
import VanLoading from "../loading";
import type { LoadingType } from '../loading'
import "./index.less";
import { MixinsButtonProps } from "../common/mixins/button";
import { MixinsOpenTypeProps, MixinsOpenTypeEvents } from "../common/mixins/open-type";

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
  ['custom-class']?: string;
  hoverClass?: string;
  ['hover-class']?: string;
  loadingClass?: string;
  ['loading-class']?: string;
  style?: React.CSSProperties;
};
export type ButtonEvents = {
  onClick?: SourceBtnProps["onClick"];
};

// ==================================

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
        isH5 && props.className,
        isWeapp && 'custom-class',
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
      hoverClass={classnames(
        "van-button--active",
        isWeapp && "hover-class",
        isH5 && props.hoverClass
      )}
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
      onGetUserInfo={props.onGetUserInfo || noop}
      onContact={props.onContact || noop}
      onGetPhoneNumber={props.onGetPhoneNumber || noop}
      onError={props.onError || noop}
      onLaunchapp={props.onLaunchapp || noop}
      onOpenSetting={props.onOpenSetting || noop}
    >
      {loading ? (
        <Block>
          <VanLoading
            className={
              classnames(
                isH5 && props.loadingClass,
                isWeapp && 'loading-class'
              )
            }
            custom-class={
              classnames(
                isH5 && props.loadingClass,
                isWeapp && 'loading-class'
              )
            }
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
              custom-class='van-button__icon'
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
VanButton.externalClasses = [
  'custom-class',
  'hover-class',
  'loading-class'
]
export default VanButton;
