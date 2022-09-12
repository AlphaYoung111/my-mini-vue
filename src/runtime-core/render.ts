import { createComponentInstance, setupComponent } from './component'
import type { ComponentInstance, VNode } from './types'

export function render(vnode: VNode, container: Element) {
  patch(vnode, container)
}

function patch(vnode: VNode, container: Element) {
  // 处理组件和element两种情况

  processComponent(vnode, container)
}

function processElement(el: Element) {

}

function processComponent(vnode: VNode, container: Element) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: VNode, container: Element) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)

  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: ComponentInstance, container: Element) {
  console.log(typeof instance.render)
  const subTree = instance.render!()
  // vnode =>  patch
  // vnode => element => mountElement
  patch(subTree, container)
}
