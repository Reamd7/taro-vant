
const PREFIX = 'van-';

function join(name: string, mods: string[]) {
    name = PREFIX + name;
    mods = mods.map(function (mod) {
        return name + '--' + mod;
    });
    mods.unshift(name);
    return mods.join(' ');
}

function traversing(mods: string[], conf?: confValue) {
    if (!conf) {
        return;
    }
    if (typeof conf === 'string' || typeof conf === 'number') {
        mods.push(String(conf));
    } else if (Array.isArray(conf)) {
        conf.forEach(function (item) {
            traversing(mods, item);
        });
    } else if (typeof conf === 'object') {
        Object.keys(conf).forEach(function (key) {
            conf[key] && mods.push(key);
        });
    }
}
type bemValue = boolean | undefined | string | number
type confValue = bemValue |
    Array<bemValue | Record<string, bemValue>> |
    Record<string, bemValue>
export function bem(name: string, conf?:
    confValue
) {
    const mods: string[] = [];
    traversing(mods, conf);
    return join(name, mods);
}
