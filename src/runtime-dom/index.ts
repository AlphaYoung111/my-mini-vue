import { createRender } from '../runtime-core/index'
import { isOn } from '@/shared'

function createElement(type) {
  return document.createElement(type)
}

function patchProp(el: HTMLElement, key: string, val: any) {
  if (isOn(key)) {
    const eventName = key.slice(2).toLowerCase()
    el.addEventListener(eventName, val)
  }
  else {
    el.setAttribute(key, val)
  }
}

function insert(el: HTMLElement, parent: HTMLElement) {
  parent.appendChild(el)
}

const render = createRender({
  createElement,
  patchProp,
  insert,
})

export function createApp(params) {
  return render.createApp(params)
}

export * from '../runtime-core'
