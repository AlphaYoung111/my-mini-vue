import type { VNode, VNodeType } from './types'

export function createVNode(type: VNodeType, props?, children?): VNode {
  const vnode = {
    type,
    props,
    children,
  }

  return vnode
}
