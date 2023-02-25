var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function initProps(instance, rawProps) {
  instance.props = rawProps || {};
}
const extend = Object.assign;
const isObject = (val) => typeof val === "object" && val !== null;
const hasChanged = (oldVal, newVal) => !Object.is(oldVal, newVal);
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
let activeEffect;
let shouldTrack;
class ReactiveEffect {
  constructor(fn, scheduler) {
    __publicField(this, "_fn");
    __publicField(this, "deps", []);
    __publicField(this, "active", true);
    __publicField(this, "onStop");
    this.scheduler = scheduler;
    this._fn = fn;
  }
  run() {
    if (!this.active) {
      return this._fn();
    }
    activeEffect = this;
    shouldTrack = true;
    const result = this._fn();
    shouldTrack = false;
    return result;
  }
  stop() {
    if (this.active) {
      this.onStop && this.onStop();
      cleanupEffect(this);
      this.active = false;
    }
  }
}
function cleanupEffect(effect2) {
  effect2.deps.forEach((dep) => {
    dep.delete(effect2);
  });
  effect2.deps.length = 0;
}
const targetMap = /* @__PURE__ */ new WeakMap();
function isTracking() {
  return shouldTrack && activeEffect !== void 0;
}
function track(target, key) {
  if (!isTracking()) {
    return;
  }
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = /* @__PURE__ */ new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = /* @__PURE__ */ new Set();
    depsMap.set(key, dep);
  }
  trackEffects(dep);
}
function trackEffects(dep) {
  if (dep.has(activeEffect)) {
    return;
  }
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    throw new Error(`not found ${target}`);
  }
  const dep = depsMap.get(key);
  if (!dep) {
    throw new Error(`not found ${key} in ${target}`);
  }
  triggerEffects(dep);
}
function triggerEffects(dep) {
  for (const effect2 of dep) {
    if (effect2.scheduler) {
      effect2.scheduler();
    } else {
      effect2.run();
    }
  }
}
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const readonlySet = createSetter(true);
const shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly2 = false, isShallow = false) {
  return function get2(target, key) {
    let res = Reflect.get(target, key);
    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly2;
    else if (key === ReactiveFlags.IS_READONLY)
      return isReadonly2;
    if (isShallow)
      return res;
    if (isObject(res))
      res = isReadonly2 ? readonly(res) : reactive(res);
    if (!isReadonly2)
      track(target, key);
    return res;
  };
}
function createSetter(isReadonly2 = false) {
  return function set2(target, key, value) {
    if (isReadonly2) {
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
function isReactive(value) {
  return !!value["__v_isReactive__"];
}
function isReadonly(value) {
  return !!value["__v_isReadonly__"];
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
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
function createComponentInstance(vnode, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {
    },
    emits: [],
    slots: {},
    provides: parent ? parent.provides : {},
    parent
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
function createAppAPI(render2) {
  return function createApp2(rootComponent) {
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
        render2(vnode, containerEl);
      }
    };
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
function provide(key, value) {
  var _a;
  const currentInstance2 = getCurrentInstance();
  if (currentInstance2) {
    let { provides } = currentInstance2;
    const parentProviders = (_a = currentInstance2.parent) == null ? void 0 : _a.provides;
    if (parentProviders === provides) {
      provides = currentInstance2.provides = Object.create(parentProviders);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue) {
  var _a;
  const currentInstance2 = getCurrentInstance();
  if (currentInstance2) {
    const parentProvides = (_a = currentInstance2.parent) == null ? void 0 : _a.provides;
    if (parentProvides) {
      if (key in parentProvides) {
        return parentProvides[key];
      } else if (defaultValue) {
        if (typeof defaultValue === "function") {
          return defaultValue();
        }
        return defaultValue;
      }
    }
  }
}
function createRender(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert
  } = options;
  function render2(vnode, container) {
    patch(vnode, container, null);
  }
  function patch(vnode, container, parentComponent) {
    const { shapeFlag, type } = vnode;
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent);
        }
        break;
    }
  }
  function processText(vnode, container) {
    const { children } = vnode;
    const textNode = vnode.el = document.createTextNode(children);
    container.append(textNode);
  }
  function processFragment(vnode, container, parentComponent) {
    mountChildren(vnode, container, parentComponent);
  }
  function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent);
  }
  function mountElement(vnode, container, parentComponent) {
    const { children, props, shapeFlag } = vnode;
    const el = hostCreateElement(vnode.type);
    vnode.el = el;
    if (children) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el, parentComponent);
      }
    }
    for (const key in props) {
      const val = props[key];
      hostPatchProp(el, key, val);
    }
    hostInsert(el, container);
  }
  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((item) => {
      patch(item, container, parentComponent);
    });
  }
  function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent);
  }
  function mountComponent(initialVNode, container, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }
  function setupRenderEffect(instance, initialVNode, container) {
    var _a;
    const { proxy } = instance;
    const subTree = (_a = instance.render) == null ? void 0 : _a.call(proxy);
    subTree && patch(subTree, container, instance);
    initialVNode.el = subTree.el;
  }
  return {
    createApp: createAppAPI(render2)
  };
}
function createElement(type) {
  return document.createElement(type);
}
function patchProp(el, key, val) {
  if (isOn(key)) {
    const eventName = key.slice(2).toLowerCase();
    el.addEventListener(eventName, val);
  } else {
    el.setAttribute(key, val);
  }
}
function insert(el, parent) {
  parent.appendChild(el);
}
const render = createRender({
  createElement,
  patchProp,
  insert
});
function createApp(params) {
  return render.createApp(params);
}
class RefImpl {
  constructor(value) {
    __publicField(this, "_value");
    __publicField(this, "_rawValue");
    __publicField(this, "deps");
    __publicField(this, "_v_isRef", true);
    this._rawValue = value;
    this._value = covert(value);
    this.deps = /* @__PURE__ */ new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = covert(newValue);
      triggerEffects(this.deps);
    }
  }
}
function covert(value) {
  return isObject(value) ? reactive(value) : value;
}
function trackRefValue(ref2) {
  if (isTracking()) {
    trackEffects(ref2.deps);
  }
}
function ref(value) {
  return new RefImpl(value);
}
function isRef(value) {
  return !!value._v_isRef;
}
function unRef(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
class ComputedRefImp {
  constructor(getter) {
    __publicField(this, "_getter");
    __publicField(this, "_isDirty", true);
    __publicField(this, "_value");
    __publicField(this, "_effect");
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._isDirty) {
        this._isDirty = true;
      }
    });
  }
  get value() {
    if (this._isDirty) {
      this._isDirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}
function computed(getter) {
  return new ComputedRefImp(getter);
}
function add(a, b) {
  return a + b;
}
export { add, computed, createApp, createAppAPI, createRender, createTextNode, createVNode, getCurrentInstance, h, inject, isProxy, isReactive, isReadonly, isRef, provide, reactive, readonly, ref, renderSlots, shallowReadonly, unRef };
