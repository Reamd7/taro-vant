import Taro from '@tarojs/taro';
import usePersistFn from "taro-vant/hooks/usePersistFn"
export type MixinLinkProps = {
    url?: string;
    linkType?: 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab' | 'navigateBack';
}

export function useLink<T extends MixinLinkProps>(props: T, urlKey: keyof T = 'url') {
    const url = props[urlKey];
    const jumpLink = usePersistFn(() => {
        if (url && typeof url === "string") {
            Taro[props.linkType || 'navigateTo']({ url })
        }
    }, [
        url, props.linkType
    ])

    return jumpLink
}
