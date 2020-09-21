import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useMemoClassNames } from "../common/utils";
import "./index.less";

export interface TabbarProps {
    active?: number;
    activeColor?: string;
    inactiveColor?: string;
    activeBg?: string;
    inactiveBg?: string;

    fixed?: boolean;
    border?: boolean;
    zIndex?:number;
    safeAreaInsetBottom?: boolean;
    className?: string
}
/**
 * 这里因为children不可以处理，
 * 所以，像 vant 将 tabbar 和 tabbar-item 区分开是不行的，
 * 必须将两个组合性的组件放在一个组件内使用。
 * @param props 
 */
const VanTabbar: Taro.FunctionComponent<TabbarProps> = function(props) {
    const classnames = useMemoClassNames()
    const {
        fixed = true,
        border = true,
        zIndex = 1,
        safeAreaInsetBottom = true
    } = props
    return <View
      className={classnames(
            props.className,
            border && 'van-hairline--top-bottom', // hairline.less
            fixed && 'van-tabbar--fixed',
            safeAreaInsetBottom && 'van-tabbar--safe'
        )}
      style={zIndex ? { zIndex } : undefined}
    >
        {props.children}
    </View>
}
VanTabbar.options = {
    addGlobalClass: true
}