import Taro, { useCallback } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { MixinLinkProps, useLink } from "../common/mixins/link";
import {
  useMemoClassNames,
  useMemoBem,
  useMemoCssProperties,
} from "../common/utils";
import VanIcon from "../icon";
import "./index.less";

const VanCell: Taro.FunctionComponent<{
  className?: string;
  titleClass?: string;
  labelClass?: string;
  valueClass?: string;
  rightIconClass?: string;
  hoverClass?: string;
} & {
  title?: string;
  value?: number | string;
  icon?: string;
  size?: string;
  label?: string;
  center?: boolean;
  isLink?: boolean;
  required?: boolean;
  clickable?: boolean;
  titleWidth?: string;
  arrowDirection?: string;
  useLabelSlot?: boolean;
  border?: boolean;

  style?: string;
  titleStyle?: React.CSSProperties;
} & {
  onClick?: React.ComponentProps<typeof View>["onClick"];
} & {
  renderTitle?: React.ReactNode;
  renderIcon?: React.ReactNode;
  renderLabel?: React.ReactNode;
  renderRightIcon?: React.ReactNode;
  renderExtra?: React.ReactNode;
} & MixinLinkProps> = (props) => {
  const {
    size,
    center,
    required,
    border = true,
    isLink,
    clickable,
    icon,
    titleWidth,
  } = props;

  const { jumpLink } = useLink(props);
  const onClick = useCallback(
    (
      event: Parameters<
        NonNullable<React.ComponentProps<typeof View>["onClick"]>
      >[0]
    ) => {
      props.onClick && props.onClick(event);
      jumpLink();
    },
    [props.onClick, jumpLink]
  );
  const classNames = useMemoClassNames();
  const bem = useMemoBem();
  const css = useMemoCssProperties();
  return (
    <View
      className={classNames(
        props.className,
        bem("cell", [
          size,
          {
            center,
            required,
            borderless: !border,
            clickable: isLink || clickable,
          },
        ])
      )}
      hoverClass={classNames("van-cell--hover", props.hoverClass)}
      hoverStayTime={70}
      style={props.style}
      onClick={onClick}
    >
      {/** ICON */}

      {icon ? (
        <View className="van-cell__left-icon-wrap">
          <VanIcon name={icon} className="van-cell__left-icon" />
        </View>
      ) : (
        props.renderIcon
      )}

      <View
        className={classNames(props.titleClass, "van-cell__title")}
        style={{
          ...css(
            titleWidth
              ? ({
                  maxWidth: titleWidth,
                  minWidth: titleWidth,
                } as React.CSSProperties)
              : undefined
          ),
          ...props.titleStyle,
        }}
      >
        {props.title ? <Text>{props.title}</Text> : props.renderTitle}
        {(props.label || props.useLabelSlot) && (
          <View className={classNames("van-cell__label", props.labelClass)}>
            {props.useLabelSlot && props.renderLabel}
            {props.label && <Text>{props.label}</Text>}
          </View>
        )}
      </View>
      <View className={classNames("van-cell__value", props.valueClass)}>
        {props.value || props.value === 0 ? (
          <Text>{props.value}</Text>
        ) : (
          props.children
        )}
      </View>
      {props.isLink ? (
        <View className="van-cell__right-icon-wrap">
          <VanIcon
            name={
              props.arrowDirection ? `arrow-${props.arrowDirection}` : "arrow"
            }
            className={classNames(
              props.rightIconClass,
              "van-cell__right-icon"
            )}
          />
        </View>
      ) : (
        props.renderRightIcon
      )}
      {props.renderExtra}
    </View>
  );
};

export default VanCell;
