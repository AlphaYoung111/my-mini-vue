import { ReactiveEffect } from './effect'

class ComputedRefImp {
  private _getter: Function

  private _isDirty = true

  private _value
  private _effect: ReactiveEffect

  constructor(getter) {
    this._getter = getter

    // 这样后面更新的时候就会自动去执行scheduler,解开锁重新调用函数返回新值
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._isDirty) { this._isDirty = true }
    })
  }

  get value() {
    // 使用lazy形式，这样除了第一次调用get后
    // 后续在调用get的时候就不会再调用传进来的getter函数了

    // 当调用了set改变了值之后应该解锁，从新调用函数返回新的值
    if (this._isDirty) {
      this._isDirty = false

      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImp(getter)
}
