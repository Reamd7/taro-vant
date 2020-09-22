import { useCallback } from "@tarojs/taro"

export type MixinLinkProps = {
    url?: string;
    linkType?: 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab' | 'navigateBack';
}

export function useLink<T extends MixinLinkProps>(props: T, urlKey: keyof T = 'url') {
    const url = props[urlKey];
    const jumpLink = useCallback(() => {
        if (url && typeof url === "string") {
            Taro[props.linkType || 'navigateTo']({ url })
        }
    }, [
        url
    ])

    return { jumpLink }
}
