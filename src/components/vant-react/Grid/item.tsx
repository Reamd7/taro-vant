import Taro, { useMemo } from "@tarojs/taro";

import "./item.less";
import {
  useMemoClassNames,
  useMemoBem,
  useMemoAddUnit,
  noop,
  isNormalClass,
  isExternalClass
} from "../common/utils";
import { View, Block, Text } from "@tarojs/components";
// import { useGridItemContext } from "./utils";
import VanIcon, { VanIconProps } from "../icon";
import { ITouchEvent } from "@tarojs/components/types/common";
import { useLink } from "../common/mixins/link";
import { useRelationPropsListener } from "../common/relation";
import { VanGridProps } from ".";

export type VanGridItemProps = {
  gid: string;
  index: number;
  total: number;

  text?: string;
  icon?: VanIconProps["name"];
  iconColor?: VanIconProps["color"];

  dot?: VanIconProps["dot"];
  // badge?: VanIconProps["badge"];
  info?: VanIconProps["info"];

  url?: string;
  linkType?: "redirectTo" | "switchTab" | "reLaunch" | "navigateTo";

  className?: string;
  ["custom-class"]?: string;
  contentClass?: string;
  ["content-class"]?: string;
  iconClass?: string;
  ["icon-class"]?: string;
  textClass?: string;
  ["text-class"]?: string;
  useSlot?: boolean;

  renderIcon?: React.ReactNode;
  renderText?: React.ReactNode;

  onClick?: React.ComponentProps<typeof View>["onClick"];
} & Pick<VanGridProps, "columnNum" | "iconSize" | "gutter" | "border" | "center" | "square" |
  "clickable" | "direction">;



const VanGridItem: Taro.FunctionComponent<VanGridItemProps> = props => {
  const classnames = useMemoClassNames();
  const bem = useMemoBem();
  const addUnit = useMemoAddUnit();

  const {
    index,
    text,
    icon,
    iconColor,
    dot = false,
    // badge,
    info,
    // url,
    // linkType,
    onClick = noop
  } = props;

  const jumpLink = useLink(props);

  const _onClick = (e: ITouchEvent) => {
    onClick(e);
    jumpLink();
  };
  // const ContextData = useGridItemContext(props.gid) || {};
  const {
    columnNum = 4,
    border = true,
    square = false,
    gutter = 0,
    clickable = false,
    center = true,
    direction = "vertical",
    iconSize = 26
  } = useRelationPropsListener(props.gid, props);

  const viewStyle = useMemo(() => {
    const width = `${100 / columnNum}%`;
    const viewStyle: React.CSSProperties = {
      width
    };

    if (square) {
      viewStyle["paddingTop"] = width;
    }

    if (gutter) {
      const gutterValue = addUnit(gutter);
      viewStyle.paddingRight = gutterValue;

      if (index >= columnNum && !square) {
        viewStyle.marginTop = gutterValue;
      }
    }

    return viewStyle;
  }, [columnNum, square, index, gutter]);

  const contentStyle = useMemo(() => {
    const _: React.CSSProperties = {};
    if (square && gutter) {
      const gutterValue = addUnit(gutter);

      _.right = gutterValue;
      _.bottom = gutterValue;
      _.height = "auto";
      return _;
    }
  }, []);

  return (
    <View
      className={classnames(
        isNormalClass && props.className,
        isExternalClass && "custom-class",
        bem("grid-item", { square })
      )}
      style={viewStyle}
      onClick={_onClick}
    >
      <View
        className={classnames(
          isExternalClass && "content-class",
          isNormalClass && props.className,
          bem("grid-item__content", [
            direction,
            { center, square, clickable, surround: border && gutter }
          ]),
          border ? "van-hairline--surround" : ""
        )}
        style={contentStyle}
      >
        {props.useSlot ? (
          props.children
        ) : (
            <Block>
              <View
                className={classnames(
                  "van-grid-item__icon",
                  isNormalClass && props.iconClass,
                  isExternalClass && "icon-class"
                )}
              >
                {icon ? (
                  <VanIcon
                    name={icon}
                    color={iconColor}
                    dot={dot}
                    // badge={badge}
                    info={info}
                    size={iconSize}
                  />
                ) : (
                    props.renderIcon
                  )}
              </View>
              <View
                className={classnames(
                  isNormalClass && props.textClass,
                  isExternalClass && "text-class",
                  "van-grid-item__text"
                )}
              >
                {text ? <Text>{text}</Text> : props.renderText}
              </View>
            </Block>
          )}
      </View>
    </View>
  );
};

VanGridItem.options = {
  addGlobalClass: true
};
VanGridItem.externalClasses = [
  "custom-class",
  "content-class",
  "icon-class",
  "text-class"
];
export default VanGridItem;
