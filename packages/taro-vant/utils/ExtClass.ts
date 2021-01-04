import { isNormalClass } from "./constant";

export function ExtClass<P extends any>(props: P, classNames: keyof P): string | undefined {
  const _class = classNames as string;
  const isnormalclassname = !(_class).includes("-"); // _class => className（nor）

  const classNamesMap = (isnormalclassname ? {
    nor: _class,
    ext: _class === "className" ? 'custom-class' : _class.replace(/[A-Z]/g, (v) => "-" + v.toLowerCase())
  } : {
      nor: _class === 'custom-class' ? 'className' : _class.replace(/-(.)/g, (v) => v[1].toUpperCase()),
      ext: _class
    })

  if (isNormalClass) return props[classNamesMap.nor];
  return classNamesMap.ext
}
