import Taro from "@tarojs/taro";
import { useState } from '@tarojs/taro' /** api **/;
import { Block, Image } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanGrid from "src/components/vant-react/Grid";
import VanGridItem from "src/components/vant-react/Grid/item";

const data = {
  array3: [0, 1, 2],
  array4: [0, 1, 2, 3],
  array6: [0, 1, 2, 3, 4, 5],
  array8: [0, 1, 2, 3, 4, 5, 6, 7]
};

export default function GridPage() {
  const [columnNum, setCol] = useState(3);
  return (
    <Block>
      <DemoBlock title="基本用法">
        <VanGrid gid="array4">
          {data.array4.map((val, index) => {
            return (
              <VanGridItem
                gid="array4"
                index={index}
                total={data.array4.length}
                icon="photo-o"
                text="文字"
                key={val}
              />
            );
          })}
        </VanGrid>
      </DemoBlock>
      <DemoBlock title="基本用法">
        <VanGrid gid="array6" columnNum={columnNum}>
          {data.array6.map((val, index) => {
            return (
              <VanGridItem
                gid="array6"
                index={index}
                total={data.array6.length}
                icon="photo-o"
                text="文字"
                key={val}
              />
            );
          })}
        </VanGrid>
      </DemoBlock>

      <DemoBlock title="自定义内容">
        <VanGrid columnNum={columnNum} border={false} gid="array3">
          {data.array3.map((val, index) => {
            return (
              <VanGridItem
                gid="array3"
                index={index}
                total={data.array3.length}
                icon="photo-o"
                text="文字"
                key={val}
                clickable
                onClick={() => setCol(index + 3)}
                useSlot
              >
                <Image
                  style="width: 100%; height: 90px;"
                  src={`https://img.yzcdn.cn/vant/apple-${ index + 1 }.jpg`}
                />
              </VanGridItem>
            );
          })}
        </VanGrid>
      </DemoBlock>

      <DemoBlock title="正方形格子">
        <VanGrid square gid="array8">
          {data.array8.map((val, index) => {
            return (
              <VanGridItem
                gid="array8"
                index={index}
                total={data.array8.length}
                icon="photo-o"
                text="文字"
                key={val}
              />
            );
          })}
        </VanGrid>
      </DemoBlock>

      <DemoBlock title="格子间距">
        <VanGrid gutter={10} gid="array8-gutter">
          {data.array8.map((val, index) => {
            return (
              <VanGridItem
                gid="array8-gutter"
                index={index}
                total={data.array8.length}
                icon="photo-o"
                text="文字"
                key={val}
              />
            );
          })}
        </VanGrid>
      </DemoBlock>

      <DemoBlock title="内容横排">
        <VanGrid direction="horizontal" columnNum={3} gid="array3-colunmNum">
          {data.array8.map((val, index) => {
            return (
              <VanGridItem
                gid="array3-colunmNum"
                index={index}
                total={data.array8.length}
                icon="photo-o"
                text="文字"
                key={val}
              />
            );
          })}
        </VanGrid>
      </DemoBlock>

      <DemoBlock title="页面跳转">
        <VanGrid clickable columnNum={2} gid="jump">
          <VanGridItem
            icon="home-o"
            linkType="navigateTo"
            url="/pages/dashboard/index"
            text="Navigate 跳转"
            gid="jump"
            index={0}
            total={2}

          />
          <VanGridItem
            icon="search"
            linkType="reLaunch"
            url="/pages/dashboard/index"
            text="ReLaunch 跳转"
            gid="jump"
            index={1}
            total={2}

          />
        </VanGrid>
      </DemoBlock>

      <DemoBlock title="徽标提示">
        <VanGrid columnNum={2} gid="tips">
          <VanGridItem icon="home-o" text="文字" dot gid="tips" index={0} total={2} />
          <VanGridItem
            icon="search"
            text="文字"
            info="99+"
            gid="tips"
            index={1}
            total={2}

          />
        </VanGrid>
      </DemoBlock>
    </Block>
  );
}

GridPage.config = {
  "navigationBarTitleText": "Grid 宫格"
}
