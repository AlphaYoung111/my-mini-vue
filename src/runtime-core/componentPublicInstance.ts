import type { ComponentInstance } from './types'
import { hasOwn } from '@/shared'

const publicPropertiesMap = {
  // 这里拿的是组件的实例上的el
  $el: (i: ComponentInstance) => i.vnode.el,

  $slots: (i: ComponentInstance) => i.slots,
}

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // 从setup
    const { setupState, props } = instance as ComponentInstance

    if (hasOwn(setupState, key)) {
      return setupState[key]
    }
    else if (hasOwn(props, key)) {
      return props[key]
    }

    const publicGetters = publicPropertiesMap[key]

    if (publicGetters) { return publicGetters(instance) }
  },
}
