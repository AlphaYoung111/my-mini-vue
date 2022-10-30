import type { ShapeFlags } from './../shared/ShapeFlag'

export type ContainerElement = keyof HTMLElementTagNameMap

export interface ComponentRenderCtx {
  emit: (eventKey: string, ...params) => void
}

export interface ComponentRenderObj {
  render: () => VNode
  setup?: (
    props: Readonly<PropsKey>,
    ctx: ComponentRenderCtx
  ) => object | Function
  emits?: string[]
}

// export type VNodeType = ComponentRenderObj | ContainerElement
export type VNodeType = string

export type VNodeChildren = VNode[] | string

export interface VNode {
  type: VNodeType
  props: PropsKey
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
  props: PropsKey
  emit: (eventKey: string, ...params) => void
  emits: string[]
}

export type PatchType = VNode | VNodeChildren

export type PropsKey = {
  id?: string
  class?: string | string[]
  onClick?: (e: Event) => void
} & Record<`on${Capitalize<Exclude<string, ''>>}`, (p?: unknown) => unknown>
