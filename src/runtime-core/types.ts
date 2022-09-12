export type ContainerElement = keyof HTMLElementTagNameMap

export interface ComponentRenderObj {
  render: () => VNode
  setup?: () => object | Function
}

export type VNodeType = ComponentRenderObj | string

export interface VNode {
  type: VNodeType
  props: string
  children?: VNode
}

export interface ComponentInstance {
  vnode: VNode
  setupState?: object
  type: VNodeType
  render?: () => VNode
}
