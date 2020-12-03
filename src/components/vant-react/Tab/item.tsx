import Taro, { useState, useMemo } from '@tarojs/taro';
import "./item.less"
import { Tab } from "./";
import { useMemoClassNames, useMemoBem, ExtClass } from '../common/utils';
import { View } from '@tarojs/components';
import { useRelationPropsListener } from '../common/relation';
import useUpdateEffect from 'src/common/hooks/useUpdateEffect';
export type VanTabItemProps = {
  'custom-class'?: string;
  className?: string;

  pid: string;
  index: number;
  total: number;

} & Tab

export type ActiveVanTabItemProps = {
  active?: boolean;
  lazyRender?: boolean;
  animated?: boolean;
} & VanTabItemProps

const VanTabItem: Taro.FunctionComponent<VanTabItemProps> = (props) => {
  const classname = useMemoClassNames();
  const bem = useMemoBem();

  const {
    active,
    lazyRender,
    animated
  } = useRelationPropsListener(props.pid, props) as ActiveVanTabItemProps

  const [inited, setInited] = useState(active);

  const shouldRender = useMemo(()=> inited || !lazyRender, [inited, lazyRender]);
  const shouldShow = useMemo(()=> active || animated, [active, animated]);

  useUpdateEffect(()=>{
    if (active) {
      setInited(true)
    }
  }, [active])

  return <View
    className={
      classname(
        ExtClass(props, "custom-class"),
        bem('tab__pane', { active, inactive: !active })
      )
    }
    hidden={!shouldShow}
  >
    {shouldRender && props.children}
  </View>
}
VanTabItem.externalClasses = [
  'custom-class'
]
VanTabItem.options = {
  addGlobalClass: true
}

export default VanTabItem
