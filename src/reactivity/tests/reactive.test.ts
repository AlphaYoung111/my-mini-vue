import { reactive, isReactive } from "@/reactivity/reactive";

describe('reactive',() => {
  test('happy path',() => {
    const original = {foo:1}
    const observed = reactive(original)

    expect(observed).not.toBe(original)

    expect(original.foo).toBe(1)

    expect(isReactive(observed)).toBe(true)

    expect(isReactive(original)).toBe(false)
  })

  test('nested reactive', () => {
    const original = {
      nested: {
        bar: 2
      },
      arr: [{foo: 1}]
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.arr)).toBe(true)
    expect(isReactive(observed.arr[0])).toBe(true)
  })
})
