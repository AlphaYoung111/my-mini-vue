import { render } from './render'
import type { ContainerElement } from './types'
import { createVNode } from './vnode'
import { error } from '@/shared'

export function createApp(rootComponent) {
  return {
    mount(rootContainer: string & ContainerElement) {
      const vnode = createVNode(rootComponent)

      let containerEl

      if (typeof rootContainer === 'string')
        containerEl = document.querySelector(rootContainer)

      else
        containerEl = rootContainer

      if (!rootContainer)
        error(`can not find element ${rootContainer} on document`)

      render(vnode, containerEl)
    },
  }
}
