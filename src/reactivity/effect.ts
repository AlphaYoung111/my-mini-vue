class ReactiveEffect {
  private _fn:Function
  constructor(fn:Function) {
    this._fn = fn;
  }

  run () {
    activeEffect = this
    this._fn()
  }
}

const targetMap = new WeakMap()
// {
//   obj: {
//     key: []
//   }
// }
export function track(target,key) {
  // target => key => deps
  let depsMap = targetMap.get(target) as WeakMap<object,WeakSet<Function>>
  if (!depsMap) {
    depsMap = new WeakMap()
    targetMap.set(target,depsMap)
  }
  
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new WeakSet()
    depsMap.set(key,dep) 
  }

  // 将当前执行得effect添加到对应得dep中
  dep.add(activeEffect)
  activeEffect = null
}

// 保存当前执行得effect
let activeEffect
export function effect (fn) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
}
