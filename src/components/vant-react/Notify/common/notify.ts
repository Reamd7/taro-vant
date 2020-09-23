import { NotifyProps } from './utils';
import { getContext } from '../../common/utils';
import { VanNotifyMap, defaultOptions } from './utils';

export default function Notify(options: NotifyProps) {
    options = { ...defaultOptions, ...options } as NotifyProps;
    const page = getContext();
    const notify = VanNotifyMap.get(page);
    if (notify) {
        notify.setData(options);
        notify.show.current();
        return notify
    }
    console.warn('未找到 van-notify 节点，请确认 selector 及 context 是否正确');
}

Notify.clear = function () {
    const page = getContext();
    const notify = VanNotifyMap.get(page);
    if (notify) {
        notify.hide.current();
    }
};
