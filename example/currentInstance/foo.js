import { getCurrentInstance, h } from '../../dist/mini-vue.es.js'

export const Foo = {
  name: 'Foo',
  setup() {
    const instance = getCurrentInstance()
    console.log('current', instance)
  },
  render() {
    return h('div', {}, `foo: ${this.count}`)
  },
}
