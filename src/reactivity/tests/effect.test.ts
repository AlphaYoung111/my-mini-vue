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
})
