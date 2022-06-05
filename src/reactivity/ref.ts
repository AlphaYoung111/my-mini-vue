import { isTracking, trackEffects, triggerEffects } from "./effect"

export class RefImpl {
  private _value: any
  deps:Set<RefImpl>
  constructor(value) {
    this._value = value
    this.deps = new Set()
  }

  get value () {
    if (isTracking()) {
      trackEffects(this.deps)
    }
    return this._value
  }

  set value (newValue) {
    if (Object.is(newValue, this._value)) return
    this._value = newValue
    triggerEffects(this.deps)
  }
}


export function ref <T>(value: T):any {
  return new RefImpl(value)
}

export interface Ref<T =any> {
  value: T
}
