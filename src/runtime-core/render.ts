import { createComponentInstance, setupComponent } from './component'
import type { ComponentInstance, ContainerElement, PatchType, VNode } from './types'
import { ShapeFlags } from '@/shared/ShapeFlag'
import { isOn } from '@/shared'

export function render(vnode: VNode, container: Element) {
  patch(vnode, container)
}

function patch(vnode: VNode, container: Element) {
  // 处理组件和element两种情况

  const { shapeFlag } = vnode
  // 非组件的情况下type为HTML标签
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container)
  }

  else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode as VNode, container)
  }
}

function processElement(vnode: PatchType, container: Element) {
  mountElement(vnode, container)
}

function mountElement(vnode: PatchType, container: Element) {
  const { children, props, shapeFlag } = vnode as VNode

  const el = document.createElement((vnode as VNode).type as ContainerElement);

  // 这里是每个element元素的el
  (vnode as VNode).el = el

  if (children) {
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children as string
    }
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode as VNode, el)
    }
  }

  // props
  for (const key in props) {
    const val = props[key]

    if (isOn(key)) {
      const eventName = key.slice(2).toLowerCase()
      el.addEventListener(eventName, val)
    }
    else {
      el.setAttribute(key, val)
    }
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

function mountComponent(initialVNode: VNode, container: Element) {
  const instance = createComponentInstance(initialVNode)

  setupComponent(instance)

  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect(instance: ComponentInstance, initialVNode: VNode, container: Element) {
  const { proxy } = instance

  const subTree = instance.render?.call(proxy)
  // vnode =>  patch
  // vnode => element => mountElement
  subTree && patch(subTree, container)

  // 在mounted完成后在将根节点的el赋值给组件
  initialVNode.el = subTree!.el
}
