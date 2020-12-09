import Taro from "@tarojs/taro";
import { useMemo } from "react";
import "./index.less";
import { View } from "@tarojs/components";
import {
  useMemoClassNames,
  useMemoBem,
  useMemoCssProperties,
  useMemoAddUnit,
  isExternalClass,
  isNormalClass
} from "../common/utils";

export type VanSkeletonPops = {
  className?: string;
  ["custom-class"]?: string;
  avatarClass?: string;
  ["avatar-class"]?: string;
  titleClass?: string;
  ["title-class"]?: string;
  rowClass?: string;
  ["row-class"]?: string;
} & {
  row?: number;
  title?: boolean;
  avatar?: boolean;
  loading?: boolean;
  animate?: boolean;
  avatarSize?: string | number;
  avatarShape?: "round" | "square";
  titleWidth?: string | number;
  rowWidth?: string | string[];
};
const VanSkeleton: Taro.FunctionComponent<VanSkeletonPops> = props => {
  const {
    row = 0,
    title = false,
    avatar = false,
    loading = true,
    animate = true,
    avatarSize = 32,
    avatarShape = "round",
    titleWidth = "40%",
    rowWidth = "100%"
  } = props;
  const isArray = useMemo(() => rowWidth instanceof Array, [rowWidth]);
  const rowArray = useMemo(() => Array.from({ length: row }).map((_, i) => i), [row]);
  const classname = useMemoClassNames();
  const bem = useMemoBem();
  const css = useMemoCssProperties();
  const addUnit = useMemoAddUnit();
  return loading ? (
    <View
      className={classname(
        isExternalClass && "custom-class",
        isNormalClass && props.className,
        bem("skeleton", [{ animate }])
      )}
    >
      {avatar && (
        <View
          className={classname(
            isNormalClass && props.avatarClass,
            isExternalClass && "avatar-class",
            bem("skeleton__avatar", [avatarShape])
          )}
          style={css({
            width: addUnit(avatarSize),
            height: addUnit(avatarSize)
          })}
        />
      )}
      <View className={bem("skeleton__content")}>
        {title && (
          <View
            className={classname(
              isNormalClass && props.titleClass,
              isExternalClass && "title-class",
              bem("skeleton__title")
            )}
            style={css({
              width: addUnit(titleWidth)
            })}
          />
        )}
        {rowArray.map((key) => {
          return (
            <View
              key={key}
              className={classname(
                isExternalClass && "row-class",
                isNormalClass && props.rowClass,
                bem("skeleton__row")
              )}
              style={css({
                width: isArray ? rowWidth[key] : (rowWidth as string)
              })}
            />
          );
        })}
      </View>
    </View>
  ) : (
      <View className={bem("skeleton__content")}>{props.children}</View>
    );
};

VanSkeleton.options = {
  addGlobalClass: true
};

export default VanSkeleton;
