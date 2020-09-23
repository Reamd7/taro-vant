import Taro from "@tarojs/taro";
import { Block, View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanButton from "../../components/vant-react/Button";
import VanNotify from "../../components/vant-react/Notify/index";
import Notify from "../../components/vant-react/Notify/common/notify";

export default function NotifyPage() {
  return (
    <Block>
      <DemoBlock padding title="基础用法">
        <VanButton
          type="danger"
          onClick={() => {
            Notify({
              message: "通知内容"
            });
          }}
        >
          基础用法
        </VanButton>
      </DemoBlock>

      <DemoBlock padding title="通知类型">
        <View className="demo-margin-bottom">
          <VanButton
            className="demo-margin-right"
            custom-class="demo-margin-right"
            type="info"
            data-type="primary"
            onClick={event => {
              const { type } = event.currentTarget.dataset;
              Notify({
                type: "primary",
                message: "通知内容"
              });
            }}
          >
            主要通知
          </VanButton>
          <VanButton
            type="primary"
            data-type="success"
            onClick={event => {
              const { type } = event.currentTarget.dataset;
              Notify({
                type: "success",
                message: "通知内容"
              });
            }}
          >
            成功通知
          </VanButton>
        </View>
        <View className="demo-margin-bottom">
          <VanButton
            className="demo-margin-right"
            custom-class="demo-margin-right"
            type="danger"
            data-type="danger"
            onClick={event => {
              console.log(event)
              const { type } = event.currentTarget.dataset;
              Notify({
                type: "danger",
                message: "通知内容"
              });
            }}
          >
            危险通知
          </VanButton>
          <VanButton
            type="warning"
            data-type="warning"
            onClick={event => {
              const { type } = event.currentTarget.dataset;
              Notify({
                type: "warning",
                message: "通知内容"
              });
            }}
          >
            警告通知
          </VanButton>
        </View>
      </DemoBlock>

      <DemoBlock padding title="自定义通知">
        <VanButton
          type="primary"
          className="demo-margin-right"
          custom-class="demo-margin-right"
          onClick={() =>
            Notify({
              message: "自定义颜色",
              color: "#ad0000",
              background: "#ffe1e1"
            })
          }
        >
          自定义颜色
        </VanButton>
        <VanButton
          type="primary"
          onClick={() =>
            Notify({
              duration: 1000,
              message: "自定义时长"
            })
          }
        >
          自定义时长
        </VanButton>
      </DemoBlock>

      <DemoBlock padding title="插入状态栏高度">
        <VanButton
          type="primary"
          className="demo-margin-right"
          onClick={() => {
            Notify({
              message: "通知内容",
              safeAreaInsetTop: true
            });
          }}
        >
          插入状态栏高度
        </VanButton>
      </DemoBlock>

      <VanNotify />
    </Block>
  );
}

