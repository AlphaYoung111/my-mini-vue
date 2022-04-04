import { isProxy } from '@/reactivity/reactive';
import { isReadonly, readonly } from '@/reactivity/reactive';
describe('readonly', () => {
  test('should nested readonly', () => {
    const original =  {
      foo: 1,
      bar: {
        baz: 2
      }
    }

    const wrapped = readonly(original)

    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped.bar)).toBe(true)
    expect(isReadonly(original.bar)).toBe(false)
    expect(isProxy(wrapped)).toBe(true)

  })

  test('should warn when set', () => {
    console.warn = vi.fn()

    const original =  {
      foo: 1,
      bar: {
        baz: 2
      }
    }

    const wrapped = readonly(original)
    wrapped.foo = 2
    expect(console.warn).toHaveBeenCalled()
  })
})
