import Taro from "@tarojs/taro";
const { useMemo } = Taro /** api **/;
import {
  useMemoClassNames,
  useMemoAddUnit,
  CssProperties,
  isExternalClass,
  isNormalClass
} from '../../utils';
import { View } from "@tarojs/components";
import "./index.less";

const VanRow: Taro.FunctionComponent<{
  gutter?: number;
  classNames?: string;
  ['custom-class']?: string;
}> = props => {
  const { gutter } = props;
  const classname = useMemoClassNames();
  const addUnit = useMemoAddUnit();
  const css = CssProperties;

  const viewStyle = useMemo(() => {
    const margin = gutter ? Number(gutter) / 2 : undefined;

    return css({
      marginRight: addUnit(margin),
      marginLeft: addUnit(margin)
    });
  }, [gutter]);

  return (
    <View
      className={classname(
        isNormalClass && props.classNames,
        isExternalClass && "custom-class",
        "van-row"
      )}
      style={viewStyle}
    >
      {props.children}
    </View>
  );
};
VanRow.options = {
  addGlobalClass: true
};
VanRow.externalClasses = ["custom-class"];
export default VanRow;
