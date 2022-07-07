import { effect, stop } from '@/reactivity/effect'
import { reactive } from '@/reactivity/reactive'

describe('effect', () => {
  test('happy path', () => {
    const user = reactive({
      age: 10,
    })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    user.age++

    expect(nextAge).toBe(12)
  })

  test('should return runner when call effect', () => {
    // effect(fn) => function(runner) => fn => return
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })

    expect(foo).toBe(11)

    const result = runner()
    expect(foo).toBe(12)
    expect(result).toBe('foo')
  })

  test('scheduler', () => {
    // 第一次仍然默认执行effect函数
    // 如果有scheduler函数得化，那么在下面每一次响应式更新得时候，就会执行scheduler函数得内容
    let dummy
    let run
    const scheduler = vi.fn(() => {
      run = runner
    })

    const obj = reactive({ foo: 1 })

    const runner = effect(() => {
      dummy = obj.foo
    }, {
      scheduler,
    })

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manualy run
    run()
    // should have run
    expect(dummy).toBe(2)
    obj.foo++
    expect(dummy).toBe(2)
  })

  test('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })

    obj.prop = 2
    expect(dummy).toBe(2)
    // stop track
    stop(runner)
    // obj.prop = 3
    // 这里相当于又触发了收集依赖的操作，我们上一步刚把依赖清完，这里又添加了
    // 导致下面赋值的时候触发了依赖，倒是prop更新了变成了3
    obj.prop++ // obj.prop = obj.prop + 1
    expect(dummy).toBe(2)

    // restart track reactive
    runner()
    expect(dummy).toBe(3)
  })

  test('onStop', () => {
    const obj = reactive({ foo: 1 })
    const onStop = vi.fn()
    let dummy
    const runner = effect(() => {
      dummy = obj.foo
    }, {
      onStop,
    })

    stop(runner)
    expect(onStop).toHaveBeenCalledTimes(1)
  })
})
