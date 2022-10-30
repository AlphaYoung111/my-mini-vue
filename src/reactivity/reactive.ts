import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandler'
import { isObject } from '@/shared'

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive__',
  IS_READONLY = '__v_isReadonly__',
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value)
}

export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandlers)
}

function createActiveObject(target: any, baseHandlers) {
  if (!isObject(target)) {
    console.warn(`target ${target} is not a object`)
    return target
  }
  return new Proxy(target, baseHandlers)
}
