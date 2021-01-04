import Taro from "@tarojs/taro";
const { useState, useCallback, useRef } = Taro /** api **/;
import { Block, View } from '@tarojs/components'
import DemoBlock from "../components/demoBlock";
import VanButton from "taro-vant/Button";
import VanActionSheet from "taro-vant/ActionSheet";

import "./index.less";

const ActionSheetPage: Taro.FunctionComponent<void> = () => {
  let [data, setData] = useState({
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    show6: false,
    action1: [
      { name: "选项" },
      { name: "选项" },
      { name: "选项", subname: "副文本" }
    ],
    action2: [
      { name: "选项", color: "#07c160" },
      { loading: true },
      { name: "禁用选项", disabled: true }
    ],
    action6: [
      { name: "获取用户信息", color: "#07c160", openType: "getUserInfo" }
    ]
  });

  const toggle = useCallback(
    (type: string) => {
      setData(data = {
        ...data,
        [type]: !data[type]
      });
    },
    [data]
  );

  const ref = useRef({
    toggleActionSheet1() {
      toggle('show1');
    },

    toggleActionSheet2() {
      toggle('show2');
    },

    toggleActionSheet3() {
      toggle('show3');
    },

    toggleActionSheet4() {
      toggle('show4');
    },

    toggleActionSheet5() {
      toggle('show5');
    },
    toggleActionSheet6() {
      toggle('show6');
    },
    onGetUserInfo(e) {
      console.log(e.detail);
    }
  })

  return (
    <Block>
      <DemoBlock title="基础用法" padding>
        <VanButton type="primary" onClick={ref.current.toggleActionSheet1}>
          弹出菜单
        </VanButton>
        <VanActionSheet
          show={data.show1}
          actions={data.action1}
          onClose={ref.current.toggleActionSheet1}
          onSelect={ref.current.toggleActionSheet1}
        />
      </DemoBlock>

      <DemoBlock title="选项状态" padding>
        <VanButton type="primary" onClick={ref.current.toggleActionSheet2}>
          弹出菜单
        </VanButton>
        <VanActionSheet
          show={data.show2}
          actions={data.action2}
          onClose={ref.current.toggleActionSheet2}
          onCancel={ref.current.toggleActionSheet2}
          onSelect={ref.current.toggleActionSheet2}
        />
      </DemoBlock>

      <DemoBlock title="展示取消按钮" padding>
        <VanButton type="primary" onClick={ref.current.toggleActionSheet3}>
          弹出菜单
        </VanButton>
        <VanActionSheet
          show={data.show3}
          actions={data.action1}
          cancel-text="取消"
          onClose={ref.current.toggleActionSheet3}
        ></VanActionSheet>
      </DemoBlock>

      <DemoBlock title="展示描述信息" padding>
        <VanButton type="primary" onClick={ref.current.toggleActionSheet4}>
          弹出菜单
        </VanButton>
        <VanActionSheet
          show={data.show4}
          actions={data.action1}
          description="这是一段描述信息"
          onClose={ref.current.toggleActionSheet4}
        ></VanActionSheet>
      </DemoBlock>

      <DemoBlock title="展示标题栏" padding>
        <VanButton type="primary" onClick={ref.current.toggleActionSheet5}>
          弹出菜单
        </VanButton>
        <VanActionSheet
          show={data.show5}
          title="标题"
          onClose={ref.current.toggleActionSheet5}
        >
          <View className="content">内容</View>
        </VanActionSheet>
      </DemoBlock>

      <DemoBlock title="微信开发能力" padding>
        <VanButton type="primary" onClick={ref.current.toggleActionSheet6}>
          弹出菜单
        </VanButton>
        <VanActionSheet
          show={data.show6}
          title="标题"
          onClose={ref.current.toggleActionSheet6}
          actions={[
            { name: "获取用户信息", color: "#07c160", openType: "getUserInfo" }
          ]}
          onGetUserInfo={ref.current.onGetUserInfo}
        ></VanActionSheet>
      </DemoBlock>
    </Block>
  );
};

ActionSheetPage.options = {
  addGlobalClass: true
};

ActionSheetPage.config = {
  "navigationBarTitleText": "ActionSheet 上拉菜单"
}
export default ActionSheetPage;
