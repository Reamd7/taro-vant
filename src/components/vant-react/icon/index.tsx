import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import classNames from "classnames";
import { addUnit } from "../common/utils";
import { ITouchEvent } from "@tarojs/components/types/common";
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
  classPrefix?: string;
  customStyle?: React.CSSProperties;
};

export type IconEvents = {
  onClick?(event: ITouchEvent): void;
};
const VanIcon: Taro.FunctionComponent<IconProps & IconEvents> = (props) => {
  const {
    customStyle,
    size = "inherit",
    color = "inherit",
    name,
    classPrefix = "van-icon",
  } = props;
  const isImageName = name ? name.indexOf("/") !== -1 : false;
  return (
    <View
      className={classNames(
        props.className,
        classPrefix,
        isImageName ? "van-icon--image" : `${classPrefix}-${name}`
      )}
      style={{
        color,
        fontSize: addUnit(size),
        ...customStyle,
      }}
      onClick={props.onClick}
    >
      {props.children}
      {isImageName && (
        <Image className="van-icon__image" src={name!} mode="aspectFit" />
      )}
      {(props.info !== null || props.dot) && (
        <VanInfo dot={props.dot} info={props.info} className="van-icon__info" />
      )}
    </View>
  );
};

VanIcon.options = {
  addGlobalClass: true,
}
export default VanIcon;
