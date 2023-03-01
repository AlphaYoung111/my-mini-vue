import { createComponentInstance, setupComponent } from './component'
import type { ComponentInstance, ContainerElement, Data, ParentComponentInstance, PatchFn, PatchType, ProcessTextFn, RenderOptions, RendererElement, VNode, VNodeChildren } from './types'
import { Fragment, Text } from './vnode'
import { createAppAPI } from './createApp'
import { effect } from '@/reactivity/effect'
import { ShapeFlags } from '@/shared/ShapeFlag'
import { EMPTY_OBJ } from '@/shared'

export function createRender(options: RenderOptions) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options

  function render(vnode: VNode, container: RendererElement) {
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

  const processFragment = (n1: VNode | null, n2: VNode, container: RendererElement, parentComponent: ParentComponentInstance) => {
    mountChildren(n2.children as VNode[], container, parentComponent)
  }

  function patchProps(
    el: RendererElement,
    oldProps: Data,
    newProps: Data,
  ) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key]
        const nextProp = newProps[key]

        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp)
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }

  function patchChildren(
    n1: VNode,
    n2: VNode,
    container: RendererElement,
    parentComponet: ParentComponentInstance,
  ) {
    const { shapeFlag: prevShapeFlag, children: c1 } = n1
    const { shapeFlag, children: c2 } = n2

    // 新得是文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 旧得是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 删除旧的子节点
        unmountChildren(n1.children as VNode[])
      }

      // 旧得是文本
      if (c1 !== c2) {
        hostSetElementText(container, c2)
      }
    }
    else {
      // 新得是数组
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
      }
      else {
        unmountChildren(c2 as VNode[])
      }
      mountChildren(c2 as VNode[], container, parentComponet)
    }
  }

  function unmountChildren(children: VNode[]) {
    for (const child of children) {
      const el = child.el
      hostRemove(el)
    }
  }

  function patchElement(
    n1: VNode,
    n2: VNode,
    container: RendererElement,
    parentComponent: ParentComponentInstance,
  ) {
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    // 赋值el得时候仅仅会在vnode挂载得时候进行操作
    // 这里对于n2来说就是执行得挂载操作
    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el, parentComponent)
    patchProps(el, oldProps, newProps)
  }

  function processElement(
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    parentComponent: ParentComponentInstance,
  ) {
    if (!n1) {
      mountElement(n2, container, parentComponent)
    }
    else {
      patchElement(n1, n2, container, parentComponent)
    }
  }

  function mountElement(vnode: PatchType, container: RendererElement, parentComponent: ParentComponentInstance) {
    const { children, props, shapeFlag } = vnode as VNode

    const el = hostCreateElement((vnode as VNode).type as ContainerElement);

    // 这里是每个element元素的el
    (vnode as VNode).el = el

    if (children) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children as string
      }
      else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren((vnode as VNode).children as VNode[], el, parentComponent)
      }
    }

    // props
    for (const key in props) {
      const val = props[key]

      hostPatchProp(el, key, null, val)
    }

    hostInsert(el, container)
  }

  function mountChildren(children: VNode[], container: RendererElement, parentComponent: ParentComponentInstance) {
    children.forEach((item) => {
      patch(null, item, container, parentComponent)
    })
  }

  function processComponent(n1: VNode | null, n2: VNode, container: RendererElement, parentComponent: ParentComponentInstance) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent(initialVNode: VNode, container: RendererElement, parentComponent: ParentComponentInstance) {
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)

    setupRenderEffect(instance, initialVNode, container)
  }

  function setupRenderEffect(instance: ComponentInstance, initialVNode: VNode, container: RendererElement) {
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
      }
    })
  }

  return {
    createApp: createAppAPI(render),
  }
}
