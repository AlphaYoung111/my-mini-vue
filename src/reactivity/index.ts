export function add(a: number, b: number) {
  return a + b
}

export { ref, isRef, unRef, proxyRefs } from './ref'
export {
  reactive,
  readonly,
  shallowReadonly,
  isProxy,
  isReactive,
  isReadonly,
} from './reactive'
export { computed } from './computed'
