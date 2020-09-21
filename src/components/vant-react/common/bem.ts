
const PREFIX = 'van-';

function join(name: string, mods: string[]) {
    name = PREFIX + name;
    mods = mods.map(function (mod) {
        return name + '--' + mod;
    });
    mods.unshift(name);
    return mods.join(' ');
}

function traversing(mods: string[], conf?: string |
    Array<string | Record<string, boolean | undefined | string>> |
    Record<string, boolean | undefined | string>
) {
    if (!conf) {
        return;
    }
    // if (typeof conf === 'string' || typeof conf === 'number') {
    if (typeof conf === 'string') {
        mods.push(conf);
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

export default function bem(name: string, conf?:
    string |
    Array<string | Record<string, boolean | undefined | string>> |
    Record<string, boolean | undefined | string>
) {
    const mods: string[] = [];
    traversing(mods, conf);
    return join(name, mods);
}
