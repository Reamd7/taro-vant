import Taro, { useState, useCallback } from "@tarojs/taro";
import DemoBlock from "../components/demoBlock";
import VanCell from "../../components/vant-react/Cell";
import VanTransition from "../../components/vant-react/Transition";
import "./index.less";

export default function TransitionPage() {
  const [data, setData] = useState({
    show: false,
    name: "fade",
    showCustom: false
  });

  const trigger = useCallback(
    (name: string) => {
      setData({
        ...data,
        name,
        show: true
      });
      setTimeout(() => {
        setData({
          ...data,
          show: false
        });
      }, 500);
    },
    [data]
  );

  return (
    <DemoBlock title="基础用法" padding>
      <VanCell
        title="Fade"
        onClick={() => {
          trigger("fade");
        }}
        isLink
      />
      <VanCell
        title="Fade Up"
        onClick={() => {
          trigger("fade-up");
        }}
        isLink
      />
      <VanCell
        title="Fade Down"
        onClick={() => {
          trigger("fade-down");
        }}
        isLink
      />
      <VanCell
        title="Fade Left"
        onClick={() => {
          trigger("fade-left");
        }}
        isLink
      />
      <VanCell
        title="Fade Right"
        onClick={() => {
          trigger("fade-right");
        }}
        isLink
      />
      <VanCell
        title="Slide Up"
        onClick={() => {
          trigger("slide-up");
        }}
        isLink
      />
      <VanCell
        title="Slide Down"
        onClick={() => {
          trigger("slide-down");
        }}
        isLink
      />
      <VanCell
        title="Slide Left"
        onClick={() => {
          trigger("slide-left");
        }}
        isLink
      />
      <VanCell
        title="Slide Right"
        onClick={() => {
          trigger("fade");
        }}
        isLink
      />
      <VanCell
        title="Custom"
        onClick={() => {
          setData({ ...data, showCustom: true });
          setTimeout(() => {
            setData({ ...data, showCustom: false });
          }, 1000);
        }}
        isLink
      />
      <VanTransition
        show={data.show}
        name={data.name as "fade"}
        className="block"
      />
      <VanTransition
        show={data.showCustom}
        // name=""
        duration={{ enter: 300, leave: 1000 }}
        className="block"
        enterClass="van-enter-class"
        enterActiveClass="van-enter-active-class"
        leaveActiveClass="van-leave-active-class"
        leaveToClass="van-leave-to-class"
        onBeforeEnter={() => console.log("before enter")}
        onEnter={() => console.log("enter")}
        onAfterEnter={() => console.log("after enter")}
        onBeforeLeave={() => console.log("before leave")}
        onLeave={() => console.log("leave")}
        onAfterLeave={() => console.log("after leave")}
      />
    </DemoBlock>
  );
}
