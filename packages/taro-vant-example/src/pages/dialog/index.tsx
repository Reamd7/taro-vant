import Taro from "@tarojs/taro";
const { useState } = Taro /** api **/;
import "./index.less";
import { Block, Image } from "@tarojs/components";
import DemoBlock from "../components/demoBlock";
import VanButton from "taro-vant/Button";
import VanDialog from "taro-vant/Dialog";
import Dialog from "taro-vant/Dialog/dialog";

const message = '代码是写出来给人看的，附带能在机器上运行';

const VanDialogPage: Taro.FunctionComponent<{}> = () => {

  const [show, setShow] = useState(false);

  return <Block>
    <DemoBlock title="提示弹窗" padding>
      <VanButton type="primary" className="demo-margin-right" custom-class="demo-margin-right" onClick={() => {
        Dialog("van-dialog", {
          title: '提示弹窗',
          message,
        })
      }}>
        提示弹窗
      </VanButton>
      <VanButton type="primary" onClick={() => {
        Dialog("van-dialog", {
          message,
        })
      }}>
        提示弹窗（无标题）
      </VanButton>
    </DemoBlock>
    <DemoBlock title="圆角样式" padding>
      <VanButton type="primary" className="demo-margin-right" custom-class="demo-margin-right" onClick={() => {
        Dialog("van-dialog", {
          title: '圆角样式',
          theme: 'round-button',
          message,
        })
      }}>
        圆角样式
      </VanButton>
      <VanButton type="primary" onClick={() => {
        Dialog("van-dialog", {
          message,
          theme: 'round-button',
        })
      }}>
        圆角样式（无标题）
      </VanButton>
    </DemoBlock>
    <DemoBlock title="确认弹窗" padding>
      <VanButton type="primary" className="demo-margin-right" custom-class="demo-margin-right" onClick={() => {
        Dialog.confirm("van-dialog", {
          title: '确认弹窗',
          message,
        })
      }}>
        确认弹窗
      </VanButton>
      <VanButton type="primary" onClick={() => {
        Dialog.confirm("van-dialog", {
          title: '确认弹窗——圆角样式',
          theme: 'round-button',
          message,
        })
      }}>
        确认弹窗——圆角样式
      </VanButton>
    </DemoBlock>
    <DemoBlock title="异步关闭" padding>
      <VanButton type="primary" onClick={() => {
        Dialog.confirm("van-dialog", {
          title: '标题',
          message,
          asyncClose: true,
          onConfirm: () => {
            return new Promise<boolean>(resolve => {
              setTimeout(() => {
                resolve(true);
              }, 1000);
            })
          }
        })

      }}>
        异步关闭
      </VanButton>
    </DemoBlock>
    <DemoBlock title="组件调用" padding>
      <VanButton type="primary" onClick={() => {
        setShow(true)
      }}>
        组件调用
      </VanButton>
      <VanDialog
        gid="van-dialog2"
        title="标题"
        showCancelButton
        confirmButtonOpenType="getUserInfo"
        show={show}
        onGetUserInfo={(event) => {
          console.log(event.detail);
        }}
        onClose={() => {
          setShow(false);
          return true;
        }}
        useSlot
      >
        <Image
          className="demo-image"
          src="https://img.yzcdn.cn/public_files/2017/09/05/4e3ea0898b1c2c416eec8c11c5360833.jpg"
        />
      </VanDialog>
    </DemoBlock>
    <VanDialog gid="van-dialog" />
  </Block >
}

VanDialogPage.options = {
  addGlobalClass: true
}
VanDialogPage.config = {
  "navigationBarTitleText": "Dialog 弹出框"
}

export default VanDialogPage;
