import type { Slots } from '../types'
import { createVNode } from '../vnode'

export function renderSlots(slots: Slots, name: keyof Slots, props?: Record<string, any>) {
  const slot = slots[name]
  if (slot) {
    if (typeof slot === 'function') {
      return createVNode('div', {}, slot(props))
    }
  }
}
