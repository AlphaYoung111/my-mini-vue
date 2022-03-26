import { reactive } from "@/reactivity/reactive";

describe('reactive',() => {
  test('happy path',() => {
    const original = {foo:1}
    const observed = reactive(original)

    expect(observed).not.toBe(original)

    expect(original.foo).toBe(1)
  })
})
