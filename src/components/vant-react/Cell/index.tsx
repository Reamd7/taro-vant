import Taro, { useCallback } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { MixinLinkProps, useLink } from "../common/mixins/link";
import {
  useMemoClassNames,
  useMemoBem,
  useMemoCssProperties,
  isH5,
  isWeapp
} from "../common/utils";
import VanIcon from "../icon";
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
  icon?: string;
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
        isH5 && props.className,
        isWeapp && "custom-class",
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
      hoverClass={classNames(
        "van-cell--hover",
        isWeapp && "hover-class",
        isH5 && props.hoverClass
      )}
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
          isH5 && props.titleClass,
          isWeapp && "title-class",
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
              isWeapp && "label-class",
              isH5 && props.labelClass
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
          isWeapp && "value-class",
          isH5 && props.valueClass
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
              isH5 && props.rightIconClass,
              isWeapp && "right-icon-class",
              "van-cell__right-icon"
            )}
            className={classNames(
              isH5 && props.rightIconClass,
              isWeapp && "right-icon-class",
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
