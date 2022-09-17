const publicPropertiesMap = {
  $el: (i) => i.vnode.el
};
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState } = instance;
    if (key in setupState)
      return setupState[key];
    const publicGetters = publicPropertiesMap[key];
    if (publicGetters)
      return publicGetters(instance);
  }
};
function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {}
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
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
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
const isObject = (val) => typeof val === "object" && val !== null;
const error = (msg) => {
  throw new Error(msg);
};
function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  if (typeof vnode.type === "string")
    processElement(vnode, container);
  else if (isObject(vnode.type))
    processComponent(vnode, container);
}
function processElement(vnode, container) {
  mountElement(vnode, container);
}
function mountElement(vnode, container) {
  const { children, props } = vnode;
  const el = document.createElement(vnode.type);
  vnode.el = el;
  if (typeof children === "string")
    el.textContent = children;
  else if (Array.isArray(children))
    mountChildren(vnode, el);
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  container.appendChild(el);
}
function mountChildren(vnode, container) {
  vnode.children.forEach((item) => {
    patch(item, container);
  });
}
function processComponent(vnode, container) {
  mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
  var _a;
  const { proxy } = instance;
  const subTree = (_a = instance.render) == null ? void 0 : _a.call(proxy);
  subTree && patch(subTree, container);
  vnode.el = subTree.el;
}
function createVNode(type, props, children) {
  const vnode = {
    type,
    props,
    children,
    el: null
  };
  return vnode;
}
function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const vnode = createVNode(rootComponent);
      let containerEl;
      if (typeof rootContainer === "string")
        containerEl = document.querySelector(rootContainer);
      else
        containerEl = rootContainer;
      if (!rootContainer)
        error(`can not find element ${rootContainer} on document`);
      render(vnode, containerEl);
    }
  };
}
function h(type, props, children) {
  return createVNode(type, props, children);
}
export { createApp, h };
