export const extend = Object.assign

export const isObject = (val: unknown) => typeof val === 'object' && val !== null

export const hasChanged = (oldVal: any, newVal: any) => !Object.is(oldVal, newVal)

export const error = (msg: string) => {
  throw new Error(msg)
}

export const isOn = (key: string) => /^on[A-Z]/.test(key)

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key)

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const camelize = (str: string) => str.split('-').map(item => capitalize(item)).join('')

export const toHandlerKey = (str: string) => str ? `on${camelize(str)}` : ''

export const EMPTY_OBJ = {}
