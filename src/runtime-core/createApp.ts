import { render } from './render'
import type { ContainerElement } from './types'
import { createVNode } from './vnode'

export function createApp(rootComponent) {
  return {
    mount(rootContainer: ContainerElement) {
      const vnode = createVNode(rootComponent)

      render(vnode, rootContainer)
    },
  }
}
