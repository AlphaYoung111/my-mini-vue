class ReactiveEffect {
  private _fn: Function
  constructor(fn: Function) {
    this._fn = fn;
  }

  run() {
    activeEffect = this
    return this._fn()
  }
}

const targetMap = new WeakMap()
// {
//   obj: {
//     key: []
//   }
// }
export function track(target, key) {
  // target => key => deps
  let depsMap = targetMap.get(target) as Map<PropertyKey, Set<ReactiveEffect>>
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  // 将当前执行得effect添加到对应得dep中
  dep.add(activeEffect)

}


export function trigger(target, key, value) {
  let depsMap = targetMap.get(target) as Map<PropertyKey, Set<ReactiveEffect>>
  if (!depsMap) {
    throw new Error(`not found ${target}`)
  }
  
  let dep = depsMap.get(key)
  if (!dep) {
    throw new Error(`not found ${key} in ${target}`)
  }

  for (const effect of dep) {
    effect.run()
  }


}

// 保存当前执行得effect
let activeEffect
export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  // 接收到同时，立马执行一次传进来得函数
  _effect.run()

  // 因为返回出去得时候ReactiveEffect类内部涉及到this指向问题，所以需要bind回来
  return _effect.run.bind(_effect)
}
