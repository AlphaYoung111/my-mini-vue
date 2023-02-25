function initProps(instance, rawProps) {
  instance.props = rawProps || {};
}
const extend = Object.assign;
const isObject = (val) => typeof val === "object" && val !== null;
const error = (msg) => {
  throw new Error(msg);
};
const isOn = (key) => /^on[A-Z]/.test(key);
const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const camelize = (str) => str.split("-").map((item) => capitalize(item)).join("");
const toHandlerKey = (str) => str ? `on${camelize(str)}` : "";
const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots
};
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }
    const publicGetters = publicPropertiesMap[key];
    if (publicGetters) {
      return publicGetters(instance);
    }
  }
};
function emit(instance, eventKey, ...params) {
  const { props } = instance;
  const eventHandlerName = toHandlerKey(eventKey);
  const emitHandler = props[eventHandlerName];
  emitHandler && emitHandler(...params);
}
var ShapeFlags = /* @__PURE__ */ ((ShapeFlags2) => {
  ShapeFlags2[ShapeFlags2["ELEMENT"] = 1] = "ELEMENT";
  ShapeFlags2[ShapeFlags2["STATEFUL_COMPONENT"] = 2] = "STATEFUL_COMPONENT";
  ShapeFlags2[ShapeFlags2["TEXT_CHILDREN"] = 4] = "TEXT_CHILDREN";
  ShapeFlags2[ShapeFlags2["ARRAY_CHILDREN"] = 8] = "ARRAY_CHILDREN";
  ShapeFlags2[ShapeFlags2["SLOT_CHILDREN"] = 16] = "SLOT_CHILDREN";
  return ShapeFlags2;
})(ShapeFlags || {});
function initSlots(instance, children) {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectsSlots(children, instance.slots);
  }
}
function normalizeObjectsSlots(children, slots) {
  if (isObject(children)) {
    for (const key in children) {
      const value = children[key];
      slots[key] = (props) => normalizeSlotValue(value(props));
    }
  }
}
function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
const targetMap = /* @__PURE__ */ new WeakMap();
function trigger(target, key, value) {
  const depsMap = targetMap.get(target);
  if (!depsMap)
    throw new Error(`not found ${target}`);
  const dep = depsMap.get(key);
  if (!dep)
    throw new Error(`not found ${key} in ${target}`);
  triggerEffects(dep);
}
function triggerEffects(dep) {
  for (const effect2 of dep) {
    if (effect2.scheduler)
      effect2.scheduler();
    else
      effect2.run();
  }
}
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const readonlySet = createSetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, isShallow = false) {
  return function get2(target, key) {
    let res = Reflect.get(target, key);
    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly;
    else if (key === ReactiveFlags.IS_READONLY)
      return isReadonly;
    if (isShallow)
      return res;
    if (isObject(res))
      res = isReadonly ? readonly(res) : reactive(res);
    return res;
  };
}
function createSetter(isReadonly = false) {
  return function set2(target, key, value) {
    if (isReadonly) {
      console.warn(`${key} is readonly, target can not be set, ${target}`);
      return true;
    }
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}
const mutableHandlers = {
  get,
  set
};
const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet
};
const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});
var ReactiveFlags = /* @__PURE__ */ ((ReactiveFlags2) => {
  ReactiveFlags2["IS_REACTIVE"] = "__v_isReactive__";
  ReactiveFlags2["IS_READONLY"] = "__v_isReadonly__";
  return ReactiveFlags2;
})(ReactiveFlags || {});
function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers);
}
function createActiveObject(target, baseHandlers) {
  if (!isObject(target)) {
    console.warn(`target ${target} is not a object`);
    return target;
  }
  return new Proxy(target, baseHandlers);
}
function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {
    },
    emits: [],
    slots: {}
  };
  component.emit = emit.bind(null, component);
  return component;
}
function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStateFulComponent(instance);
}
function setupStateFulComponent(instance) {
  const component = instance.type;
  const { setup } = component;
  if (setup) {
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    });
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
}
function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
let currentInstance = null;
function getCurrentInstance() {
  return currentInstance;
}
function setCurrentInstance(instance) {
  currentInstance = instance;
}
const Fragment = Symbol("Fragment");
const Text = Symbol("Text");
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
  } else if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (isObject(vnode.children)) {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN;
    }
  }
  return vnode;
}
function createTextNode(text) {
  return createVNode(Text, {}, text);
}
function getShapeFlag(type) {
  return typeof type === "string" ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT;
}
function render(vnode, container) {
  patch(vnode, container);
}
function patch(vnode, container) {
  const { shapeFlag, type } = vnode;
  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container);
      }
      break;
  }
}
function processText(vnode, container) {
  const { children } = vnode;
  const textNode = vnode.el = document.createTextNode(children);
  container.append(textNode);
}
function processFragment(vnode, container) {
  mountChildren(vnode, container);
}
function processElement(vnode, container) {
  mountElement(vnode, container);
}
function mountElement(vnode, container) {
  const { children, props, shapeFlag } = vnode;
  const el = document.createElement(vnode.type);
  vnode.el = el;
  if (children) {
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el);
    }
  }
  for (const key in props) {
    const val = props[key];
    if (isOn(key)) {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, val);
    } else {
      el.setAttribute(key, val);
    }
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
function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const vnode = createVNode(rootComponent);
      let containerEl;
      if (typeof rootContainer === "string") {
        containerEl = document.querySelector(rootContainer);
      } else {
        containerEl = rootContainer;
      }
      if (!rootContainer) {
        error(`can not find element ${rootContainer} on document`);
      }
      render(vnode, containerEl);
    }
  };
}
function h(type, props, children) {
  return createVNode(type, props, children);
}
function renderSlots(slots, name, props) {
  const slot = slots[name];
  if (slot) {
    if (typeof slot === "function") {
      return createVNode(Fragment, {}, slot(props));
    }
  }
}
export { createApp, createTextNode, createVNode, getCurrentInstance, h, renderSlots };
