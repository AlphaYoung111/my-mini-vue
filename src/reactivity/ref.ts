import { isTracking, trackEffects, triggerEffects } from './effect'
import { reactive } from '@/reactivity/reactive'
import { hasChanged, isObject } from '@/shared'

export class RefImpl {
  private _value: any
  private _rawValue: any
  deps: Set<RefImpl>
  public _v_isRef = true
  constructor(value) {
    // 因为进行对比的时候，需要对比的是原始对象
    // 所以我们单独存储原始值
    this._rawValue = value

    // 判断是否为对象
    this._value = covert(value)

    this.deps = new Set()
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue
      this._value = covert(newValue)
      triggerEffects(this.deps)
    }
  }
}

function covert(value) {
  return isObject(value) ? reactive(value) : value
}

function trackRefValue(ref) {
  if (isTracking()) { trackEffects(ref.deps) }
}

export function ref<T>(value: T): any {
  return new RefImpl(value)
}

export function isRef(value) {
  return !!value._v_isRef
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

export function proxyRefs(objWithRefs) {
  return new Proxy(objWithRefs, {
    get(target, key) {
      // 通过unRef自动解包 实现script中的ref在template中的直接使用
      return unRef(Reflect.get(target, key))
    },

    set(target, key, value) {
      // 新的值是不是ref,旧的值是ref就需要使用.value
      if (isRef(target[key]) && !isRef(value)) { return target[key].value = value }

      else { return Reflect.set(target, key, value) }
    },
  })
}

export interface Ref<T = any> {
  value: T
}
