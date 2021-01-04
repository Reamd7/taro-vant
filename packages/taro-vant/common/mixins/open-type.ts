import type { Button } from "@tarojs/components";

type SourceBtnProps = React.ComponentProps<typeof Button>;
export type MixinsOpenTypeProps = Pick<SourceBtnProps, "openType">;
export type MixinsOpenTypeEvents = Pick<
    SourceBtnProps,
    | "onGetUserInfo"
    | "onContact"
    | "onGetPhoneNumber"
    | "onError"
    | "onLaunchapp"
    | "onOpenSetting"
>;