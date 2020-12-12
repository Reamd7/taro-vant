import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanCell from "taro-vant/Cell";
import VanCellGroup from "taro-vant/CellGroup";
import VanIcon from "taro-vant/icon";
import "./index.less";

const Cell: Taro.FunctionComponent<{}> = () => {
  return (
    <View>
      <DemoBlock title="基础用法">
        <VanCellGroup>
          <VanCell title="单元格" value="内容" />
          <VanCell
            title="单元格"
            value="内容"
            label="描述信息"
            border={false}
          />
        </VanCellGroup>
      </DemoBlock>

      <DemoBlock title="单元格大小">
        <VanCellGroup>
          <VanCell title="单元格" value="内容" size="large" />
          <VanCell
            title="单元格"
            value="内容"
            size="large"
            useLabelSlot
            border={false}
            renderLabel={<View>描述信息</View>}
          ></VanCell>
        </VanCellGroup>
      </DemoBlock>

      <DemoBlock title="展示图标">
        <VanCell title="单元格" value="内容" icon="location-o" border={false} />
      </DemoBlock>

      <DemoBlock title="展示箭头">
        <VanCell title="单元格" isLink />
        <VanCell title="单元格" value="内容" isLink />
        <VanCell
          title="单元格"
          isLink
          arrow-direction="down"
          value="内容"
          border={false}
        />
      </DemoBlock>

      <DemoBlock title="页面跳转">
        <VanCell title="单元格" isLink url="/pages/dashboard/index" />
        <VanCell
          title="单元格"
          isLink
          url="/pages/dashboard/index"
          link-type="redirectTo"
        />
      </DemoBlock>

      <DemoBlock title="分组标题">
        <VanCellGroup title="分组 1">
          <VanCell title="单元格" value="内容" />
        </VanCellGroup>
        <VanCellGroup title="分组 2">
          <VanCell title="单元格" value="内容" />
        </VanCellGroup>
      </DemoBlock>

      <DemoBlock title="使用插槽">
        <VanCell
          value="内容"
          icon="shop-o"
          isLink
          renderTitle={
            <View>
              <View className="title">单元格</View>
              {/* <van-tag type="danger">标签</van-tag> */}
            </View>
          }
        ></VanCell>
        <VanCell
          title="单元格"
          border={false}
          renderRightIcon={<VanIcon name="search" />}
        ></VanCell>
      </DemoBlock>

      <DemoBlock title="垂直居中">
        <VanCell center title="单元格" value="内容" label="描述信息" />
      </DemoBlock>
    </View>
  );
};

Cell.config = {
  navigationBarTitleText: "Cell 单元格",
};

Cell.options = {
  addGlobalClass: true
}

export default Cell;
