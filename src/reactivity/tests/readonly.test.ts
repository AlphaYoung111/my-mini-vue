import { readonly } from '@/reactivity/reactive';
describe('readonly', () => {
  test('happy path', () => {
    const original =  {
      foo: 1,
      bar: {
        baz: 2
      }
    }

    const wrapped = readonly(original)

    expect(wrapped).not.toBe(original)
    expect(wrapped.foo).toBe(1)
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
