import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

function createGetter(isReadonly: boolean = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    if (!isReadonly) {
      track(target, key)
    }
    return res
  }

}

function createSetter(isReadonly: boolean = false) {
  return function set(target, key, value) {
    if (isReadonly) {
      console.warn(`${key} is readonly, target can not be set, ${target}`);
      return true
    }
    const res = Reflect.set(target, key, value);
    trigger(target, key, value)
    return res
  }
}

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const readonlySet = createSetter(true)

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet
}
