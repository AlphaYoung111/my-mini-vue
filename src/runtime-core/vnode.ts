import type { VNode, VNodeChildren, VNodeType } from './types'
import { ShapeFlags } from '@/shared/ShapeFlag'
import { isObject } from '@/shared'

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')

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

  // 判断是否为插槽 组件 + children(object)
  else if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (isObject(vnode.children)) {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }

  return vnode
}

export function createTextNode(text: string) {
  return createVNode(Text, {}, text)
}

function getShapeFlag(type: VNodeType): ShapeFlags {
  return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}
