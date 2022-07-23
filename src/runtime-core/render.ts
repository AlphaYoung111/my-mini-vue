import { createComponentInstance, setupComponent } from './component'
import type { ContainerElement, VNode } from './types'

export function render(vnode: VNode, container: ContainerElement) {
  patch(vnode, container)
}

function patch(vnode: VNode, container: ContainerElement) {
  processComponent(vnode, container)
}

function processComponent(vnode: VNode, container: ContainerElement) {
  mountComponent(vnode)
}

function mountComponent(vnode: VNode) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)
}
