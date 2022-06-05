class RefImpl {
  private _value: any
  deps:Set<RefImpl>
  constructor(value) {
    this._value = value
    this.deps = new Set()
  }

  get value () {
    return this._value
  }

  set value (value) {
    this._value = value
  }
}


export function ref <T>(value: T):any {
  return new RefImpl(value)
}

export interface Ref<T =any> {
  value: T
}
