import { initProps } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import type { ComponentInstance, ComponentRenderCtx, ComponentRenderObj, VNode } from './types'
import { emit } from './componentEmit'
import { shallowReadonly } from '@/reactivity/reactive'
export function createComponentInstance(vnode: VNode): ComponentInstance {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: (() => {}) as ComponentRenderCtx['emit'],
    emits: [],
  }

  component.emit = emit.bind(null, component)

  return component
}

export function setupComponent(instance: ComponentInstance) {
  initProps(instance, instance.vnode.props)

  // initslot

  setupStateFulComponent(instance)
}

function setupStateFulComponent(instance: ComponentInstance) {
  const component = instance.type

  const { setup } = component as unknown as ComponentRenderObj

  if (setup) {
    // 对于props是第一层无法修改
    const setupResult = setup(
      shallowReadonly(instance.props),
      {
        emit: instance.emit,
      },
    )

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
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: ComponentInstance) {
  const Component = instance.type as unknown as ComponentRenderObj

  if (Component.render) { instance.render = Component.render }
}
