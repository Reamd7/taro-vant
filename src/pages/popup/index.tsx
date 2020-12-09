import Taro from "@tarojs/taro";
const { useState, useCallback, useRef } = Taro /** api **/;
import { View } from "@tarojs/components";
import "./index.less";
import DemoBlock from "../components/demoBlock";
import VanCell from "src/components/vant-react/Cell";
import VanPopup from "src/components/vant-react/Popup";

export default function PopUpPage() {
  const [show, setShow] = useState({
    basic: false,
    top: false,
    bottom: false,
    left: false,
    right: false,
    round: false,
    closeIcon: false,
    customCloseIcon: false,
    customIconPosition: false
  });

  const toggle = useCallback(
    (type: keyof typeof show, isshow: boolean) => {
      setShow({
        ...show,
        [type]: isshow
      });
    },
    [show]
  );

  const ref = useRef({
    showBasic() {
      toggle("basic", true);
    },

    hideBasic() {
      toggle("basic", false);
    },

    showTop() {
      toggle("top", true);
    },

    hideTop() {
      toggle("top", false);
    },

    showLeft() {
      toggle("left", true);
    },

    hideLeft() {
      toggle("left", false);
    },

    showRight() {
      toggle("right", true);
    },

    hideRight() {
      toggle("right", false);
    },

    showBottom() {
      toggle("bottom", true);
    },

    hideBottom() {
      toggle("bottom", false);
    },

    showRound() {
      toggle("round", true);
    },

    hideRound() {
      toggle("round", false);
    },

    showCloseIcon() {
      toggle("closeIcon", true);
    },

    hideCloseIcon() {
      toggle("closeIcon", false);
    },

    showCustomCloseIcon() {
      toggle("customCloseIcon", true);
    },

    hideCustomCloseIcon() {
      toggle("customCloseIcon", false);
    },

    showCustomIconPosition() {
      toggle("customIconPosition", true);
    },

    hideCustomIconPosition() {
      toggle("customIconPosition", false);
    }
  });

  return (
    <View>
      <DemoBlock title="基础用法">
        <VanCell title="展示弹出层 + transition 的能力" isLink onClick={ref.current.showBasic} />
        <VanPopup
          show={show.basic}
          style={{
            padding: "30px 50px"
          }}
          transition={"scale"}
          onClose={ref.current.hideBasic}
        >
          内容
        </VanPopup>
      </DemoBlock>

      <DemoBlock title="弹出位置">
        <VanCell title="顶部弹出" isLink onClick={ref.current.showTop} />
        <VanCell title="底部弹出" isLink onClick={ref.current.showBottom} />
        <VanCell title="左侧弹出" isLink onClick={ref.current.showLeft} />
        <VanCell title="右侧弹出 + overlay={false}" isLink onClick={ref.current.showRight} />

        <VanPopup
          show={show.top}
          position="top"
          transition={"fade-down"}
          style={{
            height: "20%"
          }}
          onClose={ref.current.hideTop}
        />
        <VanPopup
          show={show.bottom}
          position="bottom"
          style={{
            height: "20%"
          }}
          onClose={ref.current.hideBottom}
        />
        <VanPopup
          show={show.left}
          position="left"
          style={{
            width: "20%",
            height: "100%"
          }}
          onClose={ref.current.hideLeft}
        />
        <VanPopup
          show={show.right}
          position="right"
          style={{
            width: "20%",
            height: "100%"
          }}
          onClose={ref.current.hideRight}
          overlay={false}
        />
      </DemoBlock>

      <DemoBlock title="关闭图标">
        <VanCell title="关闭图标" isLink onClick={ref.current.showCloseIcon} />
        <VanCell
          title="自定义图标"
          isLink
          onClick={ref.current.showCustomCloseIcon}
        />
        <VanCell
          title="图标位置"
          isLink
          onClick={ref.current.showCustomIconPosition}
        />

        <VanPopup
          show={show.closeIcon}
          closeable
          position="bottom"
          style={{
            height: "20%"
          }}
          onClose={ref.current.hideCloseIcon}
        />

        <VanPopup
          show={show.customCloseIcon}
          closeable
          closeIcon="close"
          position="bottom"
          style={{
            height: "20%"
          }}
          onClose={ref.current.hideCustomCloseIcon}
        />

        <VanPopup
          show={show.customIconPosition}
          closeable
          closeIconPosition="top-left"
          position="bottom"
          style={{
            height: "20%"
          }}
          onClose={ref.current.hideCustomIconPosition}
        />
      </DemoBlock>

      <DemoBlock title="圆角弹窗">
        <VanCell title="圆角弹窗" isLink onClick={ref.current.showRound} />

        <VanPopup
          show={show.round}
          round
          position="bottom"
          style={{
            height: "20%"
          }}
          onClose={ref.current.hideRound}
        />
      </DemoBlock>
    </View>
  );
}

PopUpPage.options = {
  addGlobalClass: true
}

PopUpPage.config = {
  "navigationBarTitleText": "Popup 弹出层"
}
