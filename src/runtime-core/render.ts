import { createComponentInstance, setupComponent } from './component'
import type { ComponentInstance, ContainerElement, ParentComponentInstance, PatchType, RenderOptions, VNode } from './types'
import { Fragment, Text } from './vnode'
import { createAppAPI } from './createApp'
import { ShapeFlags } from '@/shared/ShapeFlag'

export function createRender(options: RenderOptions) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options

  function render(vnode: VNode, container: Element) {
    patch(vnode, container, null)
  }

  function patch(vnode: VNode, container: Element, parentComponent: ParentComponentInstance) {
  // 处理组件和element两种情况, 还有特殊得fragment
    const { shapeFlag, type } = vnode

    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break

      case Text:
        processText(vnode, container)
        break

      default:
      // 非组件的情况下type为HTML标签
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent)
        }

        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode as VNode, container, parentComponent)
        }
        break
    }
  }

  function processText(vnode: VNode, container: Element) {
    const { children } = vnode
    const textNode = (vnode.el = document.createTextNode(children as string))
    container.append(textNode)
  }

  function processFragment(vnode: VNode, container: Element, parentComponent: ParentComponentInstance) {
    mountChildren(vnode, container, parentComponent)
  }

  function processElement(vnode: PatchType, container: Element, parentComponent: ParentComponentInstance) {
    mountElement(vnode, container, parentComponent)
  }

  function mountElement(vnode: PatchType, container: Element, parentComponent: ParentComponentInstance) {
    const { children, props, shapeFlag } = vnode as VNode

    const el = hostCreateElement((vnode as VNode).type as ContainerElement);

    // 这里是每个element元素的el
    (vnode as VNode).el = el

    if (children) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children as string
      }
      else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode as VNode, el, parentComponent)
      }
    }

    // props
    for (const key in props) {
      const val = props[key]

      hostPatchProp(el, key, val)
    }

    hostInsert(el, container)
  }

  function mountChildren(vnode: VNode, container: Element, parentComponent: ParentComponentInstance) {
    (vnode.children as VNode[])!.forEach((item) => {
      patch(item, container, parentComponent)
    })
  }

  function processComponent(vnode: VNode, container: Element, parentComponent: ParentComponentInstance) {
    mountComponent(vnode, container, parentComponent)
  }

  function mountComponent(initialVNode: VNode, container: Element, parentComponent: ParentComponentInstance) {
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)

    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect(instance: ComponentInstance, initialVNode: VNode, container: Element) {
    const { proxy } = instance

    const subTree = instance.render?.call(proxy)
    // vnode =>  patch
    // vnode => element => mountElement
    subTree && patch(subTree, container, instance)

    // 在mounted完成后在将根节点的el赋值给组件
    initialVNode.el = subTree!.el
  }

  return {
    createApp: createAppAPI(render),
  }
}
