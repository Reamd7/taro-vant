import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import VanButton from "../Button";

type DropDownMenuProps = {
  activeColor?: string;
  overlay?: boolean;
  zIndex?: number;
  duration?: number;
  direction?: string;
  closeOnClickOverlay?: boolean;
  closeOnClickOutside?: boolean;
};

const DropDownMenuDefaultProps: DropDownMenuProps = {
  overlay: true,
  zIndex: 10,
  duration: 200,
  direction: "down",
  closeOnClickOverlay: true,
  closeOnClickOutside: true
};

export function CreateVanDropDownMenuContext() {
  return Taro.createContext({

  })
}

const VanDropDownMenu: Taro.FunctionComponent<DropDownMenuProps> = props => {
  return (
    <View className="van-dropdown-menu van-dropdown-menu--top-bottom">

    </View>
  );
};
VanDropDownMenu.defaultProps = DropDownMenuDefaultProps;
VanDropDownMenu.options = {
  addGlobalClass: true
};
export default VanDropDownMenu;
