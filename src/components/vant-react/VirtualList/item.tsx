import Taro from "@tarojs/taro";
import { useMemo } from '@tarojs/taro' /** api **/;
import "./item.less";
import { View } from "@tarojs/components";
import { useRelationPropsListener } from "../common/relation";
import { addUnit, ExtClass } from "../common/utils";
import classNames from "classnames";
type ActiveVanVirtualListItemProps = {
  pid: string;
  index: number;
  total: number;
  itemHeight: string | number;
  dataKey: number;
  'custom-class'?: string;
  className?: string
}
export type VanVirtualListItemProps = {
  pid: string;
  index: number;
  total: number;
  dataKey: number;
  'custom-class'?: string;
  className?: string
}
const VanVirtualListItem: Taro.FC<VanVirtualListItemProps> = (props) => {
  const {
    itemHeight
  } = useRelationPropsListener(props.pid, props) as ActiveVanVirtualListItemProps;

  const style = useMemo(() => ({
    height: addUnit(itemHeight)
  }), [itemHeight])
  return <View className={
    classNames(
      ExtClass(
        props, "className"
      ),
      "van-viruallist__item"
    )
  } style={style}>
    {props.children}
  </View >
}

export default VanVirtualListItem;
