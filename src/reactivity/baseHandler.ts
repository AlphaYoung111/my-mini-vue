import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'
import { reactive, readonly } from '@/reactivity/reactive'
import { extend, isObject } from '@/shared'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const readonlySet = createSetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {
    let res = Reflect.get(target, key)

    if (key === ReactiveFlags.IS_REACTIVE)
      return !isReadonly

    else if (key === ReactiveFlags.IS_READONLY)
      return isReadonly

    if (isShallow) return res

    if (isObject(res))
      res = isReadonly ? readonly(res) : reactive(res)

    if (!isReadonly)
      track(target, key)

    return res
  }
}

function createSetter(isReadonly = false) {
  return function set(target, key, value) {
    if (isReadonly) {
      console.warn(`${key} is readonly, target can not be set, ${target}`)
      return true
    }
    const res = Reflect.set(target, key, value)
    trigger(target, key, value)
    return res
  }
}

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
