import Taro from "@tarojs/taro";
const { useRef, useCallback, useState, useEffect } = Taro /** api **/;
import { View } from "@tarojs/components";
import { ITouchEvent } from "@tarojs/components/types/common";
import { noop } from "../common/utils";
import { useTouch } from "../common/mixins/touch";
import "./index.less";

const THRESHOLD = 0.3;
function range(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export type VanSwipeCellProps = {
  name?: string;
  leftWidth?: number;
  rightWidth?: number;
  disabled?: boolean;
  asyncClose?: boolean;
  renderLeft?: React.ReactNode;
  renderRight?: React.ReactNode;

  onClick?: (position: "left" | "right" | "cell" | "outside") => unknown;
  onOpen?: (data: { position: "left" | "right"; name: string }) => unknown;
  onClose?: (data: {
    position: "left" | "right" | "cell" | "outside";
    name: string;
    instance: {
      open: (position: "left" | "right") => unknown;
      close: VoidFunction;
    };
  }) => unknown;
};

let VanSwipeCellArray: Array<Taro.MutableRefObject<{
  open: (position: "left" | "right") => void;
  close: () => void;
}>> = [];

const VanSwipeCell: Taro.FunctionComponent<VanSwipeCellProps> = props => {
  const {
    disabled = false,
    leftWidth = 0,
    rightWidth = 0,
    asyncClose = false,
    name = "",
    onOpen = noop,
    onClick = noop,
    onClose = noop
  } = props;
  const { touchRef, touchStart, touchMove } = useTouch();
  const self = useRef({
    startOffset: 0,
    offset: 0,
    dragging: true
  });
  const [wrapperStyle, setwrapperStyle] = useState<React.CSSProperties>({});
  const [catchMove, setcatchMove] = useState(false);

  const swipeMove = useCallback(
    (offset = 0) => {

      self.current.offset = range(offset, -rightWidth, leftWidth);
      const transform = `translate3d(${self.current.offset}px, 0, 0)`;
      const transition = self.current.dragging
        ? "none"
        : "transform .6s cubic-bezier(0.18, 0.89, 0.32, 1)";

      setwrapperStyle({
        transform,
        transition,
        WebkitTransform: transform,
        WebkitTransition: transition
      });
    },
    [rightWidth, leftWidth]
  );
  const open = useCallback(
    (position: "left" | "right") => {
      const offset = position === "left" ? leftWidth : -rightWidth;
      swipeMove(offset);

      onOpen({
        position,
        name: name
      });
    },
    [rightWidth, leftWidth, swipeMove, onOpen]
  );
  const close = useCallback(() => {
    swipeMove(0);
  }, [swipeMove]);

  const Ins = useRef({
    open,
    close
  });
  useEffect(() => {
    Ins.current = {
      open,
      close
    };
  }, [open, close]);
  useEffect(() => {
    VanSwipeCellArray.push(Ins);
    return function() {
      VanSwipeCellArray = VanSwipeCellArray.filter(item => item !== Ins);
    };
  }, []);

  const swipeLeaveTransition = useCallback(() => {
    const { offset } = self.current;
    if (rightWidth > 0 && -offset > rightWidth * THRESHOLD) {
      open("right");
    } else if (leftWidth > 0 && offset > leftWidth * THRESHOLD) {
      open("left");
    } else {
      swipeMove(0);
    }
  }, [rightWidth, leftWidth, open, swipeMove]);

  const onStartDrag = useCallback(
    (event: ITouchEvent) => {
      event.preventDefault()
      if (disabled) return;
      self.current.startOffset = self.current.offset;
      touchStart.current(event);
    },
    [disabled]
  );
  const onDrag = useCallback(
    (event: ITouchEvent) => {
      if (disabled) return;
      touchMove.current(event);
      if (touchRef.current.direction !== "horizontal") return;
      self.current.dragging = true;
      VanSwipeCellArray.filter(item => item !== Ins).forEach(item =>{
        item.current.close()
      });
      setcatchMove(true);
      swipeMove(self.current.startOffset + touchRef.current.deltaX);
    },
    [disabled, swipeMove]
  );
  const onEndDrag = useCallback(() => {
    if (disabled) return;
    self.current.dragging = false;
    swipeLeaveTransition();
  }, [disabled, swipeLeaveTransition]);

  const _onClick = useCallback(
    (event: ITouchEvent) => {
      event.stopPropagation()
      const { key: position = "outside" } = event.currentTarget.dataset;
      console.log(position);
      onClick(position);
      if (!self.current.offset) return;

      if (asyncClose) {
        onClose({
          position,
          name,
          instance: Ins.current
        });
      } else {
        swipeMove(0);
      }
    },
    [onClick, asyncClose, onClose, name, swipeMove]
  );
  // =================================

  return (
    <View
      className="van-swipe-cell"
      data-key="cell"
      onClick={e => {
        e.stopPropagation();
        _onClick(e);
      }}
      onTouchStart={onStartDrag}
      onTouchMove={
        catchMove
          ? e => {
              e.stopPropagation();
              onDrag(e);
            }
          : onDrag
      }
      onTouchEnd={onEndDrag}
      onTouchCancel={onEndDrag}
    >
      <View style={wrapperStyle}>
        {leftWidth && (
          <View
            className="van-swipe-cell__left"
            data-key="left"
            onClick={_onClick}
          >
            {props.renderLeft}
          </View>
        )}
        {props.children}
        {rightWidth && (
          <View
            className="van-swipe-cell__right"
            data-key="right"
            onClick={_onClick}
          >
            {props.renderRight}
          </View>
        )}
      </View>
    </View>
  );
};
VanSwipeCell.options = {
  addGlobalClass: true
};
VanSwipeCell.defaultProps = {
  name: "",
  leftWidth: 0,
  rightWidth: 0,
  disabled: false,
  asyncClose: false,
  onClick: noop,
  onClose: noop,
  onOpen: noop
};

export default VanSwipeCell;
