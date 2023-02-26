import { createComponentInstance, setupComponent } from './component'
import type { ComponentInstance, ContainerElement, ParentComponentInstance, PatchFn, PatchType, ProcessTextFn, RenderOptions, VNode } from './types'
import { Fragment, Text } from './vnode'
import { createAppAPI } from './createApp'
import { effect } from '@/reactivity/effect'
import { ShapeFlags } from '@/shared/ShapeFlag'

export function createRender(options: RenderOptions) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options

  function render(vnode: VNode, container: Element) {
    patch(null, vnode, container, null)
  }

  /**
   *
   * @param n1 旧节点
   * @param n2 新节点
   * @param container 容器
   * @param parentComponent 父组件
   */
  const patch: PatchFn = (n1, n2, container, parentComponent) => {
  // 处理组件和element两种情况, 还有特殊得fragment
    const { shapeFlag, type } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break

      case Text:
        processText(n1, n2, container)
        break

      default:
      // 非组件的情况下type为HTML标签
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        }

        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2 as VNode, container, parentComponent)
        }
        break
    }
  }

  const processText: ProcessTextFn = (n1, n2, container) => {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children as string))
    container.append(textNode)
  }

  const processFragment = (n1: VNode | null, n2: VNode, container: Element, parentComponent: ParentComponentInstance) => {
    mountChildren(n2, container, parentComponent)
  }

  function processElement(n1: VNode | null, n2: PatchType, container: Element, parentComponent: ParentComponentInstance) {
    mountElement(n2, container, parentComponent)
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
      patch(null, item, container, parentComponent)
    })
  }

  function processComponent(n1: VNode | null, n2: VNode, container: Element, parentComponent: ParentComponentInstance) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent(initialVNode: VNode, container: Element, parentComponent: ParentComponentInstance) {
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)

    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect(instance: ComponentInstance, initialVNode: VNode, container: Element) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance

        instance.subTree = (instance.render)?.call(proxy) || null
        const subTree = instance.subTree
        // vnode =>  patch
        // vnode => element => mountElement
        subTree && patch(null, subTree, container, instance)

        // 在mounted完成后在将根节点的el赋值给组件
        initialVNode.el = subTree!.el

        instance.isMounted = true
      }
      else {
        const { proxy } = instance

        const prevSubTree = instance.subTree
        const subTree = instance.render?.call(proxy)

        instance.subTree = subTree || null

        subTree && patch(prevSubTree, subTree, container, instance)

        // 在mounted完成后在将根节点的el赋值给组件
        initialVNode.el = subTree!.el

        instance.isMounted = true
        console.log('更新')
      }
    })
  }

  return {
    createApp: createAppAPI(render),
  }
}
