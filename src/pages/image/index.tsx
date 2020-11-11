import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import VanRow from "src/components/vant-react/Layout/Row";
import VanImage from "src/components/vant-react/Image";
import VanCol from "src/components/vant-react/Layout/Col";
import VanLoading from "src/components/vant-react/Loading";
import DemoBlock from "../components/demoBlock";

import "./index.less";
const fits = [
  "contain",
  "cover",
  "fill",
  "none",
  // "scale-down",
  "widthFix",
  "heightFix",
] as const;
const src = "https://img.yzcdn.cn/vant/cat.jpeg";
const ImagePage: Taro.FunctionComponent<{}> = () => {
  return (
    <View>
      <DemoBlock title="基础用法" padding>
        <VanRow>
          <VanImage width="100" height="100" src={src} />
        </VanRow>
        F
      </DemoBlock>

      <DemoBlock title="填充模式" padding>
        <VanRow gutter={20}>
          {fits.map((fit) => (
            <VanCol key={fit} span="8" gutter={20}>
              <VanImage fit={fit} width="100%" height="27vw" src={src} />
              <View className="text">{fit}</View>
            </VanCol>
          ))}
        </VanRow>
      </DemoBlock>

      <DemoBlock title="圆形图片" padding>
        <VanRow gutter={20}>
          {fits.map((fit) => (
            <VanCol key={fit} span="8" gutter={20}>
              <VanImage round fit={fit} width="100%" height="27vw" src={src} />
              <View className="text">{fit}</View>
            </VanCol>
          ))}
        </VanRow>
      </DemoBlock>

      <DemoBlock title="加载中提示" padding>
        <VanRow gutter={20}>
          <VanCol span="8" gutter={20}>
            <VanImage width="100%" height="27vw" />
            <View className="text">默认提示</View>
          </VanCol>

          <VanCol span="8" gutter={20}>
            <VanImage
              width="100%"
              height="27vw"
              useLoadingSlot
              renderLoading={<VanLoading type="spinner" size="20" vertical />}
            ></VanImage>
            <View className="text">自定义提示</View>
          </VanCol>
        </VanRow>
      </DemoBlock>

      <DemoBlock title="加载失败提示" padding>
        <VanRow gutter={20}>
          <VanCol span="8" gutter={20}>
            <VanImage width="100%" height="27vw" src="x" />
            <View className="text">默认提示</View>
          </VanCol>

          <VanCol span="8" gutter={20}>
            <VanImage
              width="100%"
              height="27vw"
              src="x"
              useErrorSlot
              renderError={<Text>加载失败</Text>}
            />
            <View className="text">自定义提示</View>
          </VanCol>
        </VanRow>
      </DemoBlock>
    </View>
  );
};

ImagePage.config = {
  navigationBarTitleText: "ImagePage 图片",
};

ImagePage.options = {
  addGlobalClass: true,
};

export default ImagePage;
