import { getCurrentInstance } from './component'

export function provide<T = any>(key: string, value: T) {
  const currentInstance = getCurrentInstance()

  if (currentInstance) {
    let { provides } = currentInstance
    const parentProviders = currentInstance.parent?.provides

    // 一样取父级，根据原型链向上查找
    // 不一样直接取自己  (一样指的组件有没有重新定义和父级一样得key再次往下provide)
    if (parentProviders === provides) {
      provides = currentInstance.provides = Object.create(parentProviders)
    }
    provides[key] = value
  }
}

export function inject(key: string, defaultValue?: any) {
  const currentInstance = getCurrentInstance()
  if (currentInstance) {
    const parentProvides = currentInstance.parent?.provides
    if (parentProvides) {
      if (key in parentProvides) {
        return parentProvides[key]
      }
      else if (defaultValue) {
        if (typeof defaultValue === 'function') {
          return defaultValue()
        }
        return defaultValue
      }
    }
  }
}
