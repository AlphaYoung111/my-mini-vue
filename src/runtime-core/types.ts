import type { ShapeFlags } from './../shared/ShapeFlag'

export type ContainerElement = keyof HTMLElementTagNameMap

export interface ComponentRenderObj {
  render: () => VNode
  setup?: () => object | Function
}

// export type VNodeType = ComponentRenderObj | ContainerElement
export type VNodeType = string

export type VNodeChildren = VNode[] | string

export interface VNode {
  type: VNodeType
  props: object
  children?: VNodeChildren
  el: HTMLElement | null
  shapeFlag: ShapeFlags
}

export interface ComponentInstance {
  vnode: VNode
  setupState: object
  type: VNodeType
  render?: () => VNode
  proxy?: object
}

export type PatchType = VNode | VNodeChildren
