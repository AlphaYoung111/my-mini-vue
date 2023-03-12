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
    patch(null, vnode, container, null, null)
  }

  /**
   *
   * @param n1 旧节点
   * @param n2 新节点
   * @param container 容器
   * @param parentComponent 父组件
   */
  const patch: PatchFn = (
    n1,
    n2,
    container,
    parentComponent,
    anchor,
  ) => {
  // 处理组件和element两种情况, 还有特殊得fragment
    const { shapeFlag, type } = n2

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break

      case Text:
        processText(n1, n2, container)
        break

      default:
      // 非组件的情况下type为HTML标签
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor)
        }

        else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2 as VNode, container, parentComponent, anchor)
        }
        break
    }
  }

  const processText: ProcessTextFn = (n1, n2, container) => {
    const { children } = n2
    const textNode = (n2.el = document.createTextNode(children as string))
    container.append(textNode)
  }

  const processFragment = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    parentComponent: ParentComponentInstance,
    anchor: RendererElement | null,
  ) => {
    mountChildren(n2.children as VNode[], container, parentComponent, anchor)
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
    anchor: RendererElement | null,
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
        mountChildren(c2 as VNode[], container, parentComponet, anchor)
      }
      else {
        // array diff array
        patchKeyedChildren(c1 as VNode[], c2 as VNode[], container, parentComponet, anchor)
      }
    }
  }

  function patchKeyedChildren(
    c1: VNode[],
    c2: VNode[],
    container: RendererElement,
    parentComponet: ParentComponentInstance,
    parentAnchor: RendererElement | null,
  ) {
    const l2 = c2.length
    let i = 0
    let e1 = c1.length - 1
    let e2 = l2 - 1

    // 1.从左侧开始出现最大相同成组值
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = c2[i]

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponet, parentAnchor)
      }
      else {
        break
      }

      i++
    }

    // 2.从右侧开始出现最大相同成组值
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = c2[e2]

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponet, parentAnchor)
      }
      else {
        break
      }

      e1--
      e2--
    }

    // 3. 新的比老的多 需要进行创建
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? c2[nextPos].el : null

        while (i <= e2) {
          patch(null, c2[i], container, parentComponet, anchor)
          i++
        }
      }
    }
    else if (i > e2) {
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++
      }
    }
    else {
      // 中间对比
      const s1 = i
      const s2 = i

      // 新的，除去前后双端对比后中间节点的数量
      const toBePatched = e2 - s2 + 1
      let patched = 0

      const keyToNewIndexMap = new Map()

      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]

        keyToNewIndexMap.set(nextChild.key, i)
      }

      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]

        if (patched >= toBePatched) {
          hostRemove(prevChild.el)
          continue
        }

        let newIndex
        // 匹配null undefined 用户有给key的情况
        if (prevChild.key !== null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        }
        else {
          for (let j = s2; j <= e2; j++) {
            if (isSameVNodeType(prevChild, c2[j])) {
              newIndex = j
              break
            }
          }
        }

        // 找不到说明是被删了，上面的情况都没有走进来
        if (newIndex === undefined) {
          hostRemove(prevChild.el)
        }
        else {
          patch(prevChild, c2[newIndex], container, parentComponet, null)
          patched++
        }
      }
    }
    console.log(i)
  }

  function isSameVNodeType(n1: VNode, n2: VNode) {
    return n1.type === n2.type && n1.key === n2.key
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
    anchor: RendererElement | null,
  ) {
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    // 赋值el得时候仅仅会在vnode挂载得时候进行操作
    // 这里对于n2来说就是执行得挂载操作
    const el = (n2.el = n1.el)

    patchChildren(n1, n2, el!, parentComponent, anchor)
    patchProps(el!, oldProps, newProps)
  }

  function processElement(
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    parentComponent: ParentComponentInstance,
    anchor: RendererElement | null,
  ) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor)
    }
    else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }

  function mountElement(
    vnode: PatchType,
    container: RendererElement,
    parentComponent: ParentComponentInstance,
    anchor: RendererElement | null,
  ) {
    const { children, props, shapeFlag } = vnode as VNode

    const el = hostCreateElement((vnode as VNode).type as ContainerElement);

    // 这里是每个element元素的el
    (vnode as VNode).el = el

    if (children) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children as string
      }
      else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren((vnode as VNode).children as VNode[], el, parentComponent, anchor)
      }
    }

    // props
    for (const key in props) {
      const val = props[key]

      hostPatchProp(el, key, null, val)
    }

    hostInsert(el, container, anchor)
  }

  function mountChildren(
    children: VNode[],
    container: RendererElement,
    parentComponent: ParentComponentInstance,
    anchor: RendererElement | null,
  ) {
    children.forEach((item) => {
      patch(null, item, container, parentComponent, anchor)
    })
  }

  function processComponent(
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    parentComponent: ParentComponentInstance,
    anchor: RendererElement | null,
  ) {
    mountComponent(n2, container, parentComponent, anchor)
  }

  function mountComponent(
    initialVNode: VNode,
    container: RendererElement,
    parentComponent: ParentComponentInstance,
    anchor: RendererElement | null,
  ) {
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance)

    setupRenderEffect(instance, initialVNode, container, anchor)
  }

  function setupRenderEffect(
    instance: ComponentInstance,
    initialVNode: VNode,
    container: RendererElement,
    anchor: RendererElement | null,
  ) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance

        instance.subTree = (instance.render)?.call(proxy) || null
        const subTree = instance.subTree
        // vnode =>  patch
        // vnode => element => mountElement
        subTree && patch(null, subTree, container, instance, anchor)

        // 在mounted完成后在将根节点的el赋值给组件
        initialVNode.el = subTree!.el

        instance.isMounted = true
      }
      else {
        const { proxy } = instance

        const prevSubTree = instance.subTree
        const subTree = instance.render?.call(proxy)

        instance.subTree = subTree || null

        subTree && patch(prevSubTree, subTree, container, instance, anchor)

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
