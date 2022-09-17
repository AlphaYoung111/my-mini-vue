import { createComponentInstance, setupComponent } from './component'
import type { ComponentInstance, ContainerElement, PatchType, VNode } from './types'
import { isObject } from '@/shared'

export function render(vnode: VNode, container: Element) {
  patch(vnode, container)
}

function patch(vnode: PatchType, container: Element) {
  // 处理组件和element两种情况

  // 非组件的情况下type为HTML标签
  if (typeof (vnode as VNode).type === 'string')
    processElement(vnode, container)

  else if (isObject((vnode as VNode).type))
    processComponent(vnode as VNode, container)
}

function processElement(vnode: PatchType, container: Element) {
  mountElement(vnode, container)
}

function mountElement(vnode: PatchType, container: Element) {
  const { children, props } = vnode as VNode

  const el = document.createElement((vnode as VNode).type as ContainerElement);

  // 这里是每个element元素的el
  (vnode as VNode).el = el

  if (typeof children === 'string')
    el.textContent = children

  else if (Array.isArray(children))
    mountChildren(vnode as VNode, el)

  // props
  for (const key in props) {
    const val = props[key]
    el.setAttribute(key, val)
  }

  container.appendChild(el)
}

function mountChildren(vnode: VNode, container: Element) {
  (vnode.children as VNode[])!.forEach((item) => {
    patch(item, container)
  })
}

function processComponent(vnode: VNode, container: Element) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: VNode, container: Element) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)

  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance: ComponentInstance, vnode: VNode, container: Element) {
  const { proxy } = instance

  const subTree = instance.render?.call(proxy)
  // vnode =>  patch
  // vnode => element => mountElement
  subTree && patch(subTree, container)

  // 在mounted完成后在将根节点的el赋值给组件
  vnode.el = subTree!.el
}
