import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import classNames from "classnames";
import {
  useMemoAddUnit,
  useMemoCssProperties,
  isWeapp,
  isH5
} from "../common/utils";
import VanInfo from "../info";
import "./icon.less";

export type IconProps = {
  dot?: boolean;
  name?: string;
  size?: string | number;
  info?: string | number;
  badge?: string | number;
  color?: string;
  className?: string;
  ["custom-class"]?: string;
  classPrefix?: string;
  customStyle?: React.CSSProperties;
};

export type IconEvents = {
  onClick?: React.ComponentProps<typeof View>["onClick"];
};
const VanIcon: Taro.FunctionComponent<IconProps & IconEvents> = props => {
  const { customStyle, size, color, name, classPrefix = "van-icon" } = props;
  const isImageName = name ? name.indexOf("/") !== -1 : false;

  const addUnit = useMemoAddUnit();
  const CssProperties = useMemoCssProperties();
  return (
    <View
      className={classNames(
        classPrefix,
        isImageName ? "van-icon--image" : `${classPrefix}-${name}`,
        isWeapp && "custom-class",
        isH5 && props.className
      )}
      style={CssProperties({
        color,
        fontSize: addUnit(size),
        ...customStyle
      })}
      onClick={props.onClick}
    >
      {props.children}
      {isImageName && (
        <Image className="van-icon__image" src={name!} mode="aspectFit" />
      )}
      {(props.info !== null || props.dot) && (
        <VanInfo
          dot={props.dot}
          info={props.info}
          className="van-icon__info"
          custom-class="van-icon__info"
        />
      )}
    </View>
  );
};
VanIcon.externalClasses = ["custom-class"];
VanIcon.options = {
  addGlobalClass: true
};
export default VanIcon;
