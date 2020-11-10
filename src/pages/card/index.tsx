import Taro from "@tarojs/taro";
import "./index.less";
import { View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanCard from "src/components/vant-react/Card";
import VanTag from "src/components/vant-react/Tag";
import VanButton from "src/components/vant-react/Button";

export default function VanCardPage() {
  const imageURL = 'https://img.yzcdn.cn/upload_files/2017/07/02/af5b9f44deaeb68000d7e4a711160c53.jpg';
  return <View className="container">
    <DemoBlock title="基础用法">
      <VanCard
        num="2"
        price="2.00"
        desc="描述信息"
        title="2018秋冬新款男士休闲时尚军绿飞行夹克秋冬新款男"
        thumb={imageURL}
      />
    </DemoBlock>

    <DemoBlock title="高级用法">
      <VanCard
        num="2"
        tag="标签"
        price="2.00"
        originPrice="10.00"
        desc="描述信息"
        title="2018秋冬新款男士休闲时尚军绿飞行夹克秋冬新款男"
        thumb={imageURL}
        renderTags={
          <View>
            <VanTag plain type="danger" custom-class="tag" className="tag">标签1</VanTag>
            <VanTag plain type="danger">标签2</VanTag>
          </View>
        }
        renderFooter={
          <View className="VanCard__footer" custom-class="VanCard__footer">
            <VanButton size="mini" round custom-class="button" className="button">按钮</VanButton>
            <VanButton size="mini" round>按钮</VanButton>
          </View>
        }
      />
    </DemoBlock>
  </View>
}

VanCardPage.options = {
  addGlobalClass: true
}

VanCardPage.config = {
  navigationBarTitleText: "card 商品卡片"
}
