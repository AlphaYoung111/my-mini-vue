import { isProxy, isReadonly, shallowReadonly } from '@/reactivity/reactive'

describe('shallowReadonly', () => {
  test ('should not make non-reactive properties reactive', () => {
    const props = shallowReadonly({
      n: {
        foo: 1,
      },
    })

    expect(isReadonly(props)).toBe(true)
    expect(isReadonly(props.n)).toBe(false)
    expect(isProxy(props)).toBe(true)
    expect(isProxy(props.n)).toBe(false)
  })

  test('should warn when set', () => {
    console.warn = vi.fn()

    const original = {
      foo: 1,
      bar: {
        baz: 2,
      },
    }

    const wrapped = shallowReadonly(original)
    wrapped.foo = 2
    expect(console.warn).toHaveBeenCalled()
  })
})
