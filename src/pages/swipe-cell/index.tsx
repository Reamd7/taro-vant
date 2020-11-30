import Taro from "@tarojs/taro";

import "./index.less";
import { View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanSwipeCell from "src/components/vant-react/SwipeCell";
import VanCellGroup from "src/components/vant-react/CellGroup";
import VanCell from "src/components/vant-react/Cell";

export default function SwipeCellPage() {
  return (
    <View>
      <DemoBlock title="基础用法">
        <VanSwipeCell
          rightWidth={65}
          leftWidth={65}
          renderLeft={<View className="VanSwipeCell__left">选择</View>}
          renderRight={<View className="VanSwipeCell__right">删除</View>}
        >
          <VanCellGroup>
            <VanCell title="单元格" value="内容" />
          </VanCellGroup>
        </VanSwipeCell>
      </DemoBlock>

      <DemoBlock title="异步关闭">
        <VanSwipeCell
          rightWidth={65}
          leftWidth={65}
          asyncClose
          onClose={event => {
            const { position, instance } = event;
            switch (position) {
              case "left":
              case "cell":
                instance.close();
                break;
              case "right":
                console.log("确定删除吗？")

                break;
            }
          }}
          renderLeft={<View className="VanSwipeCell__left">选择</View>}
          renderRight={<View className="VanSwipeCell__right">删除</View>}
        >
          <VanCellGroup>
            <VanCell title="单元格" value="内容" />
          </VanCellGroup>
        </VanSwipeCell>
      </DemoBlock>

      <DemoBlock title="主动打开">
        <VanSwipeCell
          rightWidth={65}
          leftWidth={65}
          name="示例"
          onOpen={(event) => {
            const { position, name } = event;
            console.log(`${name}${position}部分展示open事件被触发`)
          }}
          renderLeft={<View className="VanSwipeCell__left">选择</View>}
          renderRight={<View className="VanSwipeCell__right">删除</View>}
        >
          <VanCellGroup>
            <VanCell title="单元格" value="内容" />
          </VanCellGroup>
        </VanSwipeCell>
      </DemoBlock>
    </View>
  );
}

SwipeCellPage.options = {
  addGlobalClass: true
}
SwipeCellPage.config = {
  "navigationBarTitleText": "SwipeCell 滑动单元格"
}
