import Taro from "@tarojs/taro";
import VanIcon from "src/components/vant-react/icon";
import { View } from "@tarojs/components";
import "./index.less";

interface HomeNavProps {
  group: {
    groupName: string;
    list: Array<{
      path: string;
      title: string;
    }>;
  };
}

const DemoHomeNav: Taro.FunctionComponent<HomeNavProps> = (props) => {
  const { group } = props;
  const onClick = (event) => {
    Taro.navigateTo({
      url: event.target.dataset.url
    });
  }
  return (
    <View className="demo-home-nav">
      {group && <View className="demo-home-nav__title">{group.groupName}</View>}
      {group && <View className="demo-home-nav__group">
        {group.list.map((item) => (
          <View
            key={item.title}
            className="demo-home-nav__block"
            data-url={`/pages${item.path}/index`}
            onClick={onClick}
          >
            {item.title}
            <VanIcon name="arrow" className="demo-home-nav__icon" />
          </View>
        ))}
      </View>}
    </View>
  );
};

export default DemoHomeNav;
