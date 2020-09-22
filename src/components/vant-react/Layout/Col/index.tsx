import Taro, { useMemo } from "@tarojs/taro";
import { useMemoClassNames, useMemoBem, useMemoAddUnit, useMemoCssProperties } from "../../common/utils";
import { View } from "@tarojs/components";
import "./index.less";

const VanCol: Taro.FunctionComponent<{
  span?: number;
  offset?: number;
  gutter?: number;
  classNames?: string;
}> = (props) => {
  const { gutter, span, offset } = props;
  const classname = useMemoClassNames();
  const bem = useMemoBem();
  const addUnit = useMemoAddUnit()
  const css = useMemoCssProperties()

  const viewStyle = useMemo(() => {
    const padding = gutter ? addUnit((gutter) / 2) : gutter;
    return css({
      paddingRight: padding,
      paddingLeft: padding,
    });
  }, [gutter]);

  return (
    <View
      className={classname(
        props.classNames,
        bem("col", [span]),
        offset && `van-col--offset-${offset}`
      )}
      style={viewStyle}
    >
      {props.children}
    </View>
  );
};
VanCol.options = {
  addGlobalClass: true
}
export default VanCol;
