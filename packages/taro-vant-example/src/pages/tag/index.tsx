import Taro from "@tarojs/taro";
const { useState } = Taro /** api **/;
import { Block } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanTag from "taro-vant/Tag";

export default function VanTagPage() {
  const [data, setData] = useState({
    success: true,
    primary: true
  });
  return (
    <Block>
      <DemoBlock title="基础用法" padding>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          type="primary"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          type="success"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          type="danger"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          type="warning"
        >
          标签
        </VanTag>
      </DemoBlock>

      <DemoBlock title="圆角样式" padding>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          round
          type="primary"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          round
          type="success"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          round
          type="danger"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          round
          type="warning"
        >
          标签
        </VanTag>
      </DemoBlock>

      <DemoBlock title="标记样式" padding>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          mark
          type="primary"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          mark
          type="success"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          mark
          type="danger"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          mark
          type="warning"
        >
          标签
        </VanTag>
      </DemoBlock>

      <DemoBlock title="空心样式" padding>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          plain
          type="primary"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          plain
          type="success"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          plain
          type="danger"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          plain
          type="warning"
        >
          标签
        </VanTag>
      </DemoBlock>

      <DemoBlock title="自定义颜色" padding>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          color="#f2826a"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          color="#7232dd"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          color="#7232dd"
          plain
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          color="#ffe1e1"
          textColor="#ad0000"
        >
          标签
        </VanTag>
      </DemoBlock>

      <DemoBlock title="标签大小" padding>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          type="danger"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          type="danger"
          size="medium"
        >
          标签
        </VanTag>
        <VanTag
          className="demo-margin-right"
          custom-class="demo-margin-right"
          type="danger"
          size="large"
        >
          标签
        </VanTag>
      </DemoBlock>

      <DemoBlock title="可关闭标签" padding>
        {data.primary && (
          <VanTag
            className="demo-margin-right"
            custom-class="demo-margin-right"
            type="primary"
            size="medium"
            closeable
            onClose={() => {
              setData({
                ...data,
                primary: false
              });
            }}
          >
            标签
          </VanTag>
        )}
        {data.success && (
          <VanTag
            className="demo-margin-right"
            custom-class="demo-margin-right"
            type="success"
            size="medium"
            closeable
            onClose={() => {
              setData({
                ...data,
                success: false
              });
            }}
          >
            标签
          </VanTag>
        )}
      </DemoBlock>
    </Block>
  );
}
VanTagPage.options = {
  addGlobalClass: true
};

VanTagPage.config = {
  "navigationBarTitleText": "Tag 标记"
}
