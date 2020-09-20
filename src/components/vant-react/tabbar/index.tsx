import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classnames from 'classnames';
import "./index.less";

export interface TabbarProps {
    // active?: number;
    // activeColor?: string;
    // inactiveColor?: string;
    fixed?: boolean;
    border?: boolean;
    zIndex?:number;
    safeAreaInsetBottom?: boolean;

    className?: string
}

const VanTabbar: Taro.FunctionComponent<TabbarProps> = function(props) {
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