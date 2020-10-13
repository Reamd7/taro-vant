import Taro from "@tarojs/taro";

import "./index.less";
import { View, CoverView, Canvas } from "@tarojs/components";
import { useMemoAddUnit } from "../common/utils";

export type VanCircleProps = {
  text?: string;
  lineCap?: string;
  value?: number;
  speed?: number;
  size?: number;
  fill?: string;
  layerColor?: string;
  color?: string;
  type?: string;
  strokeWidth?: number;
  clockwise?: boolean;
}


const VanCircle: Taro.FunctionComponent<VanCircleProps> = (props) => {
  const { text, type, size } = props
  const addUnit = useMemoAddUnit();
  const asize = addUnit(size);



  return <View className="van-circle">
    <Canvas className="van-circle__canvas" type={type} style={{
      width: asize, height: asize
    }} id="van-circle" canvas-id="van-circle"></Canvas>
    {text ?
      <CoverView className="van-circle__text">{text}</CoverView> :
      <View className="van-circle__text">
        {props.children}
      </View>}
  </View>
}

export default VanCircle;
