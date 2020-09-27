import Taro, { useMemo } from "@tarojs/taro";
import { useGridContext } from "./utils";
import { View } from "@tarojs/components";
import {
  useMemoClassNames,
  useMemoAddUnit,
  isWeapp,
  isH5
} from "../common/utils";
import "./index.less";
import { VanIconProps } from "../icon";

export type VanGridProps = {
  gid: string;
  columnNum?: number;
  iconSize?: VanIconProps["size"];
  gutter?: number;
  border?: boolean;
  center?: boolean;
  square?: boolean;
  clickable?: boolean;
  direction?: "vertical" | "horizontal";

  className?: string;
  ["custom-class"]?: string;
};

const VanGrid: Taro.FunctionComponent<VanGridProps> = props => {
  const {
    columnNum = 4,
    iconSize = 26,
    gutter = 0,
    border = true,
    center = true,
    square = false,
    clickable = false,
    direction = "vertical"
  } = props;
  const Value = useMemo(() => {
    return {
      columnNum,
      iconSize,
      gutter,
      border,
      center,
      square,
      clickable,
      direction
    };
  }, [
    columnNum,
    iconSize,
    gutter,
    border,
    center,
    square,
    clickable,
    direction
  ]);

  const Context = useGridContext(props.gid, Value);

  const classnames = useMemoClassNames();
  const addUnit = useMemoAddUnit();

  const viewStyle = useMemo(() => {
    return gutter
      ? ({
          paddingLeft: addUnit(gutter)
        } as React.CSSProperties)
      : undefined;
  }, [gutter]);

  if (!Context) {
    return null;
    // throw "VanGrid 组件未挂载";
  }
  return (
    <View
      className={classnames(
        "van-grid",
        isWeapp && "custom-class",
        true && props.className,
        border && !gutter ? "van-hairline--top" : ""
      )}
      style={viewStyle}
    >
      <Context.Provider value={Value}>{props.children}</Context.Provider>
    </View>
  );
};
VanGrid.options = {
  addGlobalClass: true
};

export default VanGrid;
