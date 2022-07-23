import type { ComponentInstance, ComponentRenderObj, VNode } from './types'
export function createComponentInstance(vnode: VNode) {
  const component = {
    vnode,
  }

  return component
}

export function setupComponent(instance: ComponentInstance) {
  // initprops

  // initslot

  setupStateFulComponent(instance)
}

function setupStateFulComponent(instance: ComponentInstance) {
  const component = instance.vnode.type

  const { setup } = component as ComponentRenderObj

  if (setup) {
    const setupResult = setup()

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance: ComponentInstance, setupResult: Function|object) {
  // function | object
  if (typeof setupResult === 'object')
    instance.setupState = setupResult
}
