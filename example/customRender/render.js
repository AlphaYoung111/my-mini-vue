import { createRender } from '../../dist/mini-vue.es.js'
// 给基于 pixi.js 的渲染函数
const renderer = createRender({
  createElement(type) {
    if (type === 'rect') {
      const rect = new PIXI.Graphics()
      rect.beginFill(0xFF0000)
      rect.drawRect(0, 0, 100, 100)
      rect.endFill()
      return rect
    }
  },

  patchProp(el, key, nextValue) {
    el[key] = nextValue
  },

  insert(el, parent) {
    parent.addChild(el)
  },
})

export function createApp(rootComponent) {
  return renderer.createApp(rootComponent)
}
