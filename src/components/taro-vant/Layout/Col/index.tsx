import Taro from "@tarojs/taro";
const { useMemo } = Taro /** api **/;
import {
  useMemoClassNames,
  bem,
  useMemoAddUnit,
  CssProperties,
  isNormalClass,
  isExternalClass
} from 'taro-vant/utils';
import { View } from "@tarojs/components";
import "./index.less";

const VanCol: Taro.FunctionComponent<{
  span?: number | string;
  offset?: number | string;
  gutter?: number;
  classNames?: string;
  ['custom-class']?: string;
}> = props => {
  const { gutter, span, offset } = props;
  const classname = useMemoClassNames();

  const addUnit = useMemoAddUnit();
  const css = CssProperties;

  const viewStyle = useMemo(() => {
    const padding = gutter ? addUnit(gutter / 2) : gutter;
    return css({
      paddingRight: padding,
      paddingLeft: padding
    });
  }, [gutter]);

  return (
    <View
      className={classname(
        isNormalClass && props.classNames,
        isExternalClass && 'custom-class',
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
};
VanCol.externalClasses = ["custom-class"];
export default VanCol;
