import type { VNodeChildren, VNodeType } from './types'
import { createVNode } from './vnode'

export function h(type: VNodeType, props?, children?: VNodeChildren) {
  return createVNode(type, props, children)
}
