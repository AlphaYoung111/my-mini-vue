export const extend = Object.assign

export const isObject = (val: unknown) => typeof val === 'object' && val !== null

export const hasChanged = (oldVal: any, newVal: any) => !Object.is(oldVal, newVal)

export const error = (msg: string) => {
  throw new Error(msg)
}
