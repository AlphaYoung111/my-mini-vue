import { track, trigger } from "./effect";

function createGetter(isReadonly: boolean = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }

}

function createSetter(isReadonly: boolean = false) {
  return function set(target, key, value) {
    if (isReadonly) return true
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
