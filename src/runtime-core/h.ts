import type { VNodeType } from './types'
import { createVNode } from './vnode'

export function h(type: VNodeType, props?, children?) {
  return createVNode(type, props, children)
}
