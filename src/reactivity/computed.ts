class ComputedRefImp {
  private _getter: Function
  constructor(getter) {
    this._getter = getter
  }

  get value() {
    return this._getter()
  }
}

export function computed(getter) {
  return new ComputedRefImp(getter)
}
