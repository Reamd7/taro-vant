import { useRef } from '@tarojs/taro' /** api **/
import { ITouchEvent } from "@tarojs/components/types/common"


const MIN_DISTANCE = 10;

function getDirection(x: number, y: number) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal'
  }

  if (y > x && y > MIN_DISTANCE) {
    return 'vertical'
  }

  return ''
}

export function useTouch() {
  const ref = useRef({
    direction: '',
    deltaX: 0,
    deltaY: 0,
    offsetX: 0,
    offsetY: 0,
    startX: 0,
    startY: 0
  })

  const resetTouchStatus = useRef(() => {
    ref.current = {
      direction: '',
      deltaX: 0,
      deltaY: 0,
      offsetX: 0,
      offsetY: 0,
      startX: 0,
      startY: 0
    }
  });

  const touchStart = useRef((event: ITouchEvent) => {
    resetTouchStatus.current()
    const touch = event.touches[0];
    ref.current.startX = touch.clientX;
    ref.current.startY = touch.clientY;
  })

  const touchMove = useRef((event: ITouchEvent) => {
    const touch = event.touches[0];
    ref.current.deltaX = touch.clientX - ref.current.startX;
    ref.current.deltaY = touch.clientY - ref.current.startY;
    ref.current.offsetX = Math.abs(ref.current.deltaX);
    ref.current.offsetY = Math.abs(ref.current.deltaY);
    ref.current.direction =
      ref.current.direction || getDirection(ref.current.offsetX, ref.current.offsetY);
  })

  return {
    touchRef: ref,
    resetTouchStatus,
    touchStart,
    touchMove
  }
}
