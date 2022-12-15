import type { ComponentInstance } from './types'
import { toHandlerKey } from '@/shared'
export function emit(instance: ComponentInstance, eventKey: string, ...params) {
  const { props } = instance

  const eventHandlerName = toHandlerKey(eventKey)

  const emitHandler = props[eventHandlerName]
  emitHandler && emitHandler(...params)
}
