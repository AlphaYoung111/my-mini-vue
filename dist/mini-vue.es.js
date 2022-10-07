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
var ShapeFlags = /* @__PURE__ */ ((ShapeFlags2) => {
  ShapeFlags2[ShapeFlags2["ELEMENT"] = 1] = "ELEMENT";
  ShapeFlags2[ShapeFlags2["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
  ShapeFlags2[ShapeFlags2["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
  ShapeFlags2[ShapeFlags2["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
  return ShapeFlags2;
})(ShapeFlags || {});
function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  const { shapeFlag } = vnode;
  if (shapeFlag & ShapeFlags.ELEMENT)
    processElement(vnode, container);
  else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT)
    processComponent(vnode, container);
}
function processElement(vnode, container) {
  mountElement(vnode, container);
}
function mountElement(vnode, container) {
  const { children, props, shapeFlag } = vnode;
  const el = document.createElement(vnode.type);
  vnode.el = el;
  if (children) {
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
      el.textContent = children;
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
      mountChildren(vnode, el);
  }
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
function mountComponent(initialVNode, container) {
  const instance = createComponentInstance(initialVNode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
  var _a;
  const { proxy } = instance;
  const subTree = (_a = instance.render) == null ? void 0 : _a.call(proxy);
  subTree && patch(subTree, container);
  initialVNode.el = subTree.el;
}
function createVNode(type, props, children) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type)
  };
  if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }
  return vnode;
}
function getShapeFlag(type) {
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}
const error = (msg) => {
  throw new Error(msg);
};
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
