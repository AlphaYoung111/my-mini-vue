import { reactive } from '@/reactivity/reactive';
import { hasChanged, isObject } from "@/shared"
import { isTracking, trackEffects, triggerEffects } from "./effect"

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

function covert (value) {
  return isObject(value) ? reactive(value) : value
}


function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.deps)
  }
}


export function ref<T>(value: T): any {
  return new RefImpl(value)
}

export function isRef (value) {
  return !!value._v_isRef
}

export function unRef (ref) {
  return isRef(ref)? ref.value : ref
}

export interface Ref<T = any> {
  value: T
}
