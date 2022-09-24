import type { VNode, VNodeChildren, VNodeType } from './types'
import { ShapeFlags } from '@/shared/ShapeFlag'

export function createVNode(type: VNodeType, props?, children?: VNodeChildren): VNode {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type),
  }

  if (typeof children === 'string') {
    // 相当于 vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }
  else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  return vnode
}

function getShapeFlag(type: VNodeType): ShapeFlags {
  if (typeof type === 'string')
    return ShapeFlags.ELEMENT
  return ShapeFlags.STATEFUL_COMPONENT
}
