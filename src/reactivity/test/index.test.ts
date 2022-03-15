// import {describe, expect, it} from 'vitest'

import { add } from ".."

describe('test', () => {
  it('aa',() => {
    expect(true).toBe(true)
    expect(add(1,2)).toMatchInlineSnapshot('3')
  })
})
