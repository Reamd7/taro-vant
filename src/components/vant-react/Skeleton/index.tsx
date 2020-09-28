import Taro, { useMemo } from "@tarojs/taro";

import "./index.less";
import { View } from "@tarojs/components";
import {
  useMemoClassNames,
  useMemoBem,
  isWeapp,
  isH5,
  useMemoCssProperties,
  useMemoAddUnit
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
  const rowArray = useMemo(() => Array.from({ length: row }), [row]);
  const classname = useMemoClassNames();
  const bem = useMemoBem();
  const css = useMemoCssProperties();
  const addUnit = useMemoAddUnit();
  return loading ? (
    <View
      className={classname(
        isWeapp && "custom-class",
        isH5 && props.className,
        bem("skeleton", [{ animate }])
      )}
    >
      {avatar && (
        <View
          className={classname(
            isH5 && props.avatarClass,
            isWeapp && "avatar-class",
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
              isH5 && props.titleClass,
              isWeapp && "title-class",
              bem("skeleton__title")
            )}
            style={css({
              width: addUnit(titleWidth)
            })}
          />
        )}
        {rowArray.map((_, key) => {
          return (
            <View
              key={key}
              className={classname(
                isWeapp && "row-class",
                isH5 && props.rowClass,
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
