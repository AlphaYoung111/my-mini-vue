import { effect } from "../effect"
import { reactive } from "../reactive"

describe('effect', () => {
  test('happy path',() => {
    const user = reactive({
      age:10
    })

    let nextAge 
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(11)

    user.age++

    expect(nextAge).toBe(12)

  })


  test('should return runner when call effect',() => {
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

    const obj =reactive({foo:1})

    const runner = effect(() => {
      dummy = obj.foo
    },{
      scheduler
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
})
