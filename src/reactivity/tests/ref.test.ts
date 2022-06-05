import { effect } from '@/reactivity/effect';
import { ref } from "@/reactivity/ref"

describe('ref', () => {

  test('happy path', () => {
    const a = ref(1)

    expect(a.value).toBe(1)

  })

  test.skip('should be reactive', () => {
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


  test.skip('should make nested properties reactive', () => {
    const a =ref({
      count: 1
    })

    let dummy

    effect(() => {
      dummy = a.count.value
    })

    expect(dummy).toBe(1)

    a.count.value = 2
    
    expect(dummy).toBe(2)
  }) 

})
