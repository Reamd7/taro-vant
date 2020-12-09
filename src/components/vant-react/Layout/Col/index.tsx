import Taro from "@tarojs/taro";
import { useMemo } from 'react'
import {
  useMemoClassNames,
  useMemoBem,
  useMemoAddUnit,
  useMemoCssProperties,
  isNormalClass,
  isExternalClass
} from "../../common/utils";
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
  const bem = useMemoBem();
  const addUnit = useMemoAddUnit();
  const css = useMemoCssProperties();

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
