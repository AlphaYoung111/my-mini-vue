import { extend } from "@/shared";

// 保存当前执行得effect
let activeEffect: ReactiveEffect | null
let shouldTrack

class ReactiveEffect {
  private _fn: Function
  deps = [] as Set<ReactiveEffect>[]
  // 当前是否为stop过
  active = true
  onStop?: () => void
  constructor(fn: Function, public scheduler?: Function) {
    this._fn = fn;
  }

  run() {
    if (!this.active) {
      return this._fn()
    }

    // 非stop的情况下，开启开关收集状态
    activeEffect = this
    shouldTrack = true
    const result = this._fn()
    shouldTrack = false
    return result
  }

  stop() {
    if (this.active) {
      this.onStop && this.onStop()
      cleanupEffect(this)
      this.active = false
    }

  }
}

function cleanupEffect(effect: ReactiveEffect) {
  effect.deps.forEach(dep => {
    dep.delete(effect)
  })
  effect.deps.length = 0
}

const targetMap = new WeakMap()
// {
//   obj: {
//     key: []
//   }
// }

function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function track(target, key) {
  if (!isTracking()) return

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

  trackEffects(dep)
}

// 这里抽离添加dep的逻辑，因为ref，不需要上面使用key的形式
export function trackEffects(dep) {
  // 将当前执行得effect添加到对应得dep中
  if (dep.has(activeEffect!)) return
  dep.add(activeEffect!)
  // 将当前属性得所有effect存储到自己得身上，方便stop进行清空想要更新得effect
  activeEffect!.deps.push(dep)
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
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }

  }


}

interface EffectOptions {
  scheduler: Function
  onStop: () => void
}

export function effect(fn: Function, options?: Partial<EffectOptions>) {
  const _effect = new ReactiveEffect(fn, options?.scheduler)

  extend(_effect, options)

  // 接收到同时，立马执行一次传进来得函数
  _effect.run()


  // 因为返回出去得时候ReactiveEffect类内部涉及到this指向问题，所以需要bind回来
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}


export function stop(runner: any) {
  runner.effect.stop()
}
