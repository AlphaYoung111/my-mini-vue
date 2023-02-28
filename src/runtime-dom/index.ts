import { createRender } from '../runtime-core/index'
import { isOn } from '@/shared'

function createElement(type) {
  return document.createElement(type)
}

function patchProp(
  el: HTMLElement,
  key: string,
  prevVal: any,
  nextVal: any,
) {
  if (isOn(key)) {
    const eventName = key.slice(2).toLowerCase()
    el.addEventListener(eventName, nextVal)
  }
  else {
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key)
    }
    else {
      el.setAttribute(key, nextVal)
    }
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
