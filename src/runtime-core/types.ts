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
export type VNodeType = string | Symbol | ComponentInstance

export type VNodeChildren = VNode[] | string | Slots

export type RendererNode = Record<string, any>

export interface RendererElement extends RendererNode {}

export type Data = Record<string, unknown>

export interface VNode {
  type: VNodeType
  props: PropsKey
  children?: VNodeChildren
  el: RendererElement | null
  shapeFlag: ShapeFlags
  key: string | number | symbol | null
}

export type PatchFn = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  parentComponent: ParentComponentInstance,
  anchor: RendererElement | null
) => void

export type ProcessTextFn = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
) => void

export type ProcessElementFn = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  parentComponent: ParentComponentInstance
) => void

export interface ComponentInstance {
  isMounted: boolean
  name?: string
  vnode: VNode
  setupState: object
  type: VNodeType
  render?: () => VNode
  proxy?: object
  props: PropsKey
  emit: (eventKey: string, ...params) => void
  emits: string[]
  slots: Slots
  provides: Record<string, any>
  parent: ParentComponentInstance
  subTree: VNode | null
}

export type ParentComponentInstance = ComponentInstance | null

export type PatchType = VNode | VNodeChildren

export type PropsKey = {
  id?: string
  class?: string | string[]
  onClick?: (e: Event) => void
} & Record<`on${Capitalize<Exclude<string, ''>>}`, (p?: unknown) => unknown>

export type SlotChildren = (props?: Record<string, any>) => VNodeChildren

export type Slots = {
  default?: SlotChildren
}& Record<string, SlotChildren>

export interface RenderOptions {
  createElement: (type) => any
  patchProp: (el, key, prevVal, nextVal) => void
  insert: (child, container, anchor) => void
  remove: (el) => void
  setElementText: (el, textChildren) => void
}
