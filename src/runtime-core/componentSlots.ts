import type { ComponentInstance, SlotChildren, Slots, VNodeChildren } from './types'
import { isObject } from '@/shared'
import { ShapeFlags } from '@/shared/ShapeFlag'

export function initSlots(
  instance: ComponentInstance,
  children?: VNodeChildren,
) {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectsSlots(children!, instance.slots)
  }
}

function normalizeObjectsSlots(children: VNodeChildren, slots: Slots) {
  if (isObject(children)) {
    for (const key in (children as Slots)) {
      const value = children![key] as SlotChildren
      slots[key] = props => normalizeSlotValue(value(props))
    }
  }
}

function normalizeSlotValue(value: ReturnType<SlotChildren>): any {
  return Array.isArray(value) ? value : [value]
}
