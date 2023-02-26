import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import type { ComponentInstance, ComponentRenderCtx, ComponentRenderObj, VNode } from './types'
import { emit } from './componentEmit'
import { initSlots } from './componentSlots'
import { proxyRefs } from '@/reactivity/ref'
import { shallowReadonly } from '@/reactivity/reactive'

export function createComponentInstance(vnode: VNode, parent: ComponentInstance | null): ComponentInstance {
  const component: ComponentInstance = {
    isMounted: false,
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: (() => {}) as ComponentRenderCtx['emit'],
    emits: [],
    slots: {},
    provides: parent ? parent.provides : {},
    parent,
    subTree: null,
  }

  component.emit = emit.bind(null, component)

  return component
}

export function setupComponent(instance: ComponentInstance) {
  initProps(instance, instance.vnode.props)

  initSlots(instance, instance.vnode.children)

  setupStateFulComponent(instance)
}

function setupStateFulComponent(instance: ComponentInstance) {
  const component = instance.type

  const { setup } = component as unknown as ComponentRenderObj

  if (setup) {
    setCurrentInstance(instance)

    // 对于props是第一层无法修改
    const setupResult = setup(
      shallowReadonly(instance.props),
      {
        emit: instance.emit,
      },
    )

    setCurrentInstance(null)

    handleSetupResult(instance, setupResult)
  }

  instance.proxy = new Proxy(
    { _: instance },
    PublicInstanceProxyHandlers,
  )
}

function handleSetupResult(instance: ComponentInstance, setupResult: Function|object) {
  // function | object
  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult)
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: ComponentInstance) {
  const Component = instance.type as unknown as ComponentRenderObj

  if (Component.render) {
    instance.render = Component.render
  }
}

let currentInstance: ComponentInstance | null = null
export function getCurrentInstance() {
  return currentInstance
}

function setCurrentInstance(instance: ComponentInstance | null) {
  currentInstance = instance
}
