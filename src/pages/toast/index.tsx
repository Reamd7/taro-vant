import Taro from "@tarojs/taro";
import { Block, View } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanButton from "src/components/vant-react/Button";
import VanToast from "src/components/vant-react/Toast";
import { Toast } from "src/components/vant-react/Toast/toast";

export default function ToastPage() {
  return (
    <Block>
      <DemoBlock title="文字提示" padding>
        <VanButton
          type="primary"
          onClick={() => Toast("提示内容")}
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          文字提示
        </VanButton>
        <VanButton
          type="primary"
          onClick={() => Toast("这是一条长文字提示，超过一定字数就会换行")}
        >
          长文字提示
        </VanButton>
      </DemoBlock>

      <DemoBlock title="加载提示" padding>
        <VanButton
          type="primary"
          onClick={() =>
            Toast.loading({ message: "加载中...", forbidClick: true })
          }
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          加载提示
        </VanButton>
        <VanButton
          type="primary"
          onClick={() =>
            Toast.loading({
              message: "加载中...",
              forbidClick: true,
              loadingType: "spinner"
            })
          }
        >
          自定义加载图标
        </VanButton>
      </DemoBlock>

      <DemoBlock title="成功/失败提示" padding>
        <VanButton
          type="info"
          onClick={() => Toast.success("成功文案")}
          className="demo-margin-right"
          custom-class="demo-margin-right"
        >
          成功提示
        </VanButton>
        <VanButton type="danger" onClick={() => Toast.fail("失败提示")}>
          失败提示
        </VanButton>
      </DemoBlock>

      <DemoBlock title="动态更新提示" padding>
        <VanButton
          type="primary"
          onClick={() => {
            const text = second => `倒计时 ${second} 秒`;
            const toast = Toast.loading({
              duration: 0,
              forbidClick: true,
              message: text(3)
            });
            if (toast) {
              let second = 3;
              const timer = setInterval(() => {
                second--;
                if (second) {
                  toast.setData.current({ message: text(second) });
                } else {
                  clearInterval(timer);
                  Toast.clear();
                }
              }, 1000);
            }
          }}
        >
          动态更新提示
        </VanButton>
      </DemoBlock>

      <VanToast />
    </Block>
  );
}
