import type { ComponentInstance } from './types'

const publicPropertiesMap = {
  // 这里拿的是组件的实例上的el
  $el: (i: ComponentInstance) => i.vnode.el,
}

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    // 从setup
    const { setupState } = instance
    if (key in setupState)

      return setupState[key]

    const publicGetters = publicPropertiesMap[key]

    if (publicGetters)
      return publicGetters(instance)
  },
}
