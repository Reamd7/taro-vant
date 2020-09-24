import Taro, { useState, useCallback } from "@tarojs/taro";
import DemoBlock from "../components/demoBlock";
import VanCell from "../../components/vant-react/Cell";
import VanTransition from "../../components/vant-react/Transition";
import "./index.less";
const cusDur = { enter: 300, leave: 1000 };
const onBeforeEnter=() => console.log("before enter")
const onEnter=() => console.log("enter")
const onAfterEnter=() => console.log("after enter")
const onBeforeLeave=() => console.log("before leave")
const onLeave=() => console.log("leave")
const onAfterLeave=() => console.log("after leave")
export default function TransitionPage() {
  const [data, setData] = useState({
    show: false,
    name: "fade"
  });

  const [showCustom, setShowCustom] = useState(false);

  const trigger = useCallback((name: string) => {
    setData({
      name,
      show: true
    });
    setTimeout(() => {
      setData({
        name,
        show: false
      });
    }, 500);
  }, []);

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
          trigger("slide-right");
        }}
        isLink
      />
      <VanCell
        title="Custom"
        onClick={() => {
          setShowCustom(true);
          setTimeout(() => {
            setShowCustom(false);
          }, 1000);
        }}
        isLink
      />
      <VanTransition
        show={data.show}
        name={data.name as "fade"}
        className="block"
        custom-class="block"
      />
      <VanTransition
        show={showCustom}
        name=""
        duration={cusDur}
        className="block"
        custom-class="block"
        enterClass="van-enter-class"
        enter-class="van-enter-class"
        enterActiveClass="van-enter-active-class"
        enter-active-class="van-enter-active-class"
        leaveActiveClass="van-leave-active-class"
        leave-active-class="van-leave-active-class"
        leaveToClass="van-leave-to-class"
        leave-to-class="van-leave-to-class"
        onBeforeEnter={onBeforeEnter}
        onEnter={onEnter}
        onAfterEnter={onAfterEnter}
        onBeforeLeave={onBeforeLeave}
        onLeave={onLeave}
        onAfterLeave={onAfterLeave}
      />
    </DemoBlock>
  );
}
