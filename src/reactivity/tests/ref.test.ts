import { reactive } from '@/reactivity/reactive'
import { effect } from '@/reactivity/effect'
import { isRef, proxyRefs, ref, unRef } from '@/reactivity/ref'

describe('ref', () => {
  test('happy path', () => {
    const a = ref(1)

    expect(a.value).toBe(1)
  })

  test('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })

    expect(calls).toBe(1)
    expect(dummy).toBe(1)

    a.value = 2

    expect(calls).toBe(2)
    expect(dummy).toBe(2)

    a.value = 2
    // same value should not trigger
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })

  test('should make nested properties reactive', () => {
    const a = ref({
      count: 1,
    })

    let dummy

    effect(() => {
      dummy = a.value.count
    })

    expect(dummy).toBe(1)

    a.value.count = 2

    expect(dummy).toBe(2)
  })

  test('isRef', () => {
    const a = ref(1)
    const user = reactive({
      a: 1,
    })

    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(user.a)).toBe(false)
  })

  test('unRef', () => {
    const a = ref(1)

    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  })

  test('proxyRefs', () => {

  })

  test('proxyRefs', () => {
    const user = {
      age: ref(10),
      name: 'xiaoming',
    }

    const proxyUser = proxyRefs(user)
    expect(user.age.value).toBe(10)
    expect(proxyUser.age).toBe(10)
    expect(proxyUser.name).toBe('xiaoming')

    proxyUser.age = 20
    expect(proxyUser.age).toBe(20)
    expect(user.age.value).toBe(20)

    proxyUser.age = ref(10)
    expect(proxyUser.age).toBe(10)
    expect(user.age.value).toBe(10)
  })
})
