function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type
  };
  return component;
}
function setupComponent(instance) {
  setupStateFulComponent(instance);
}
function setupStateFulComponent(instance) {
  const component = instance.type;
  const { setup } = component;
  if (setup) {
    const setupResult = setup();
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object")
    instance.setupState = setupResult;
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  const Component = instance.type;
  if (Component.render)
    instance.render = Component.render;
}
function render(vnode, container) {
  patch(vnode);
}
function patch(vnode, container) {
  processComponent(vnode);
}
function processComponent(vnode, container) {
  mountComponent(vnode);
}
function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
  console.log(typeof instance.render);
  const subTree = instance.render();
  patch(subTree);
}
function createVNode(type, props, children) {
  const vnode = {
    type,
    props,
    children
  };
  return vnode;
}
const error = (msg) => {
  throw new Error(msg);
};
function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const vnode = createVNode(rootComponent);
      if (typeof rootContainer === "string")
        document.querySelector(rootContainer);
      if (!rootContainer)
        error(`can not find element ${rootContainer} on document`);
      render(vnode);
    }
  };
}
function h(type, props, children) {
  return createVNode(type, props, children);
}
export { createApp, h };
