import Taro, { useMemo } from "@tarojs/taro";
import { useMemoClassNames, useMemoAddUnit, useMemoCssProperties } from "../../common/utils";
import { View } from "@tarojs/components";
import "./index.less";

const VanRow: Taro.FunctionComponent<{
  gutter?: number;
  classNames?: string;
}> = (props) => {
  const { gutter } = props;
  const classname = useMemoClassNames();
  const addUnit = useMemoAddUnit()
  const css = useMemoCssProperties()

  const viewStyle = useMemo(() => {
    const margin = gutter ? Number(gutter) / 2 : undefined;
    
    return css({
      marginRight: addUnit(margin),
      marginLeft: addUnit(margin),
    });
  }, [gutter]);

  return (
    <View className={classname(props.classNames, "van-row")} style={viewStyle}>
      {props.children}
    </View>
  );
};
VanRow.options = {
  addGlobalClass: true
}
export default VanRow;
