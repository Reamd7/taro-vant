import type { Button } from "@tarojs/components";

type SourceBtnProps = React.ComponentProps<typeof Button>;
export type MixinsButtonProps = Pick<
  SourceBtnProps,
  | "id"
  | "lang"
  | "sessionFrom"
  | "sendMessageTitle"
  | "sendMessagePath"
  | "sendMessageImg"
  | "showMessageCard"
  | "appParameter"
  | "disabled"
  | "hoverClass"
>;

export const MixinsButtonExternalClass = ['hover-class']
