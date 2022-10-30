import type { ComponentInstance } from './types'
export function initProps(instance: ComponentInstance, rawProps) {
  instance.props = rawProps || {}
}
