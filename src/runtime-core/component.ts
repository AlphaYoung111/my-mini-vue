import type { ComponentInstance, ComponentRenderObj, VNode } from './types'
export function createComponentInstance(vnode: VNode): ComponentInstance {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
  }

  return component
}

export function setupComponent(instance: ComponentInstance) {
  // initprops

  // initslot

  setupStateFulComponent(instance)
}

function setupStateFulComponent(instance: ComponentInstance) {
  const component = instance.type

  const { setup } = component as ComponentRenderObj

  if (setup) {
    const setupResult = setup()

    handleSetupResult(instance, setupResult)
  }

  instance.proxy = new Proxy({}, {
    get(target, key) {
      // 从setup
      const { setupState } = instance
      if (key in setupState)
        return setupState[key]
    },
  })
}

function handleSetupResult(instance: ComponentInstance, setupResult: Function|object) {
  // function | object
  if (typeof setupResult === 'object')
    instance.setupState = setupResult

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: ComponentInstance) {
  const Component = instance.type as ComponentRenderObj

  if (Component.render)
    instance.render = Component.render
}
