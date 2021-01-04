import Taro from "@tarojs/taro";
const { useCallback } = Taro /** api **/;
import { View, Text } from "@tarojs/components";
import { MixinLinkProps, useLink } from "../common/mixins/link";
import {
  useMemoClassNames,
  bem,
  CssProperties,
  isNormalClass,
  isExternalClass
} from "../utils"
import VanIcon, { VanIconProps } from "../icon";
import "./index.less";

export type VanCellProps = {
  className?: string;
  ["custom-class"]?: string;
  titleClass?: string;
  ["title-class"]?: string;
  labelClass?: string;
  ["label-class"]?: string;
  valueClass?: string;
  ["value-class"]?: string;
  rightIconClass?: string;
  ["right-icon-class"]?: string;
  hoverClass?: string;
  ["hover-class"]?: string;
} & {
  title?: string;
  value?: number | string;
  icon?: VanIconProps['name'];
  size?: string;
  label?: string;
  center?: boolean;
  isLink?: boolean;
  required?: boolean;
  clickable?: boolean;
  titleWidth?: string;
  arrowDirection?: "left" | "up" | "down";
  border?: boolean;

  customStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
} & {
  onClick?: React.ComponentProps<typeof View>["onClick"];
} & {
  useTitleSlot?: boolean;
  renderTitle?: React.ReactNode;

  renderIcon?: React.ReactNode;

  useLabelSlot?: boolean;
  renderLabel?: React.ReactNode;
  renderRightIcon?: React.ReactNode;
  renderExtra?: React.ReactNode;
} & MixinLinkProps

const VanCell: Taro.FunctionComponent<VanCellProps> = props => {
  const {
    size,
    center,
    required,
    border = true,
    isLink,
    clickable,
    icon,
    titleWidth
  } = props;

  const jumpLink = useLink(props);
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

  const css = CssProperties;
  return (
    <View
      className={classNames(
        isNormalClass && props.className,
        isExternalClass && "custom-class",
        bem("cell", [
          size,
          {
            center,
            required,
            borderless: !border,
            clickable: isLink || clickable
          }
        ])
      )}
      hoverClass={(isLink || clickable) ? classNames(
        "van-cell--hover",
        isExternalClass && "hover-class",
        isNormalClass && props.hoverClass
      ) : ''}
      hoverStayTime={70}
      style={props.customStyle}
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
        className={classNames(
          isNormalClass && props.titleClass,
          isExternalClass && "title-class",
          "van-cell__title"
        )}
        style={{
          ...css(
            titleWidth
              ? ({
                maxWidth: titleWidth,
                minWidth: titleWidth
              } as React.CSSProperties)
              : undefined
          ),
          ...props.titleStyle
        }}
      >
        {props.title ? <Text>{props.title}</Text> :
          (props.useTitleSlot && props.renderTitle)}
        {(props.label || props.useLabelSlot) && (
          <View
            className={classNames(
              "van-cell__label",
              isExternalClass && "label-class",
              isNormalClass && props.labelClass
            )}
          >
            {props.useLabelSlot && props.renderLabel}
            {props.label && <Text>{props.label}</Text>}
          </View>
        )}
      </View>
      <View
        className={classNames(
          "van-cell__value",
          isExternalClass && "value-class",
          isNormalClass && props.valueClass
        )}
      >
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
            custom-class={classNames(
              isNormalClass && props.rightIconClass,
              isExternalClass && "right-icon-class",
              "van-cell__right-icon"
            )}
            className={classNames(
              isNormalClass && props.rightIconClass,
              isExternalClass && "right-icon-class",
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
VanCell.externalClasses = [
  "custom-class",
  "title-class",
  "label-class",
  "value-class",
  "right-icon-class",
  "hover-class"
];
VanCell.options = {
  addGlobalClass: true
}
export default VanCell;
