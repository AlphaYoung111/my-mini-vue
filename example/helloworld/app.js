import { h } from '../../dist/mini-vue.es.js'
import { Foo } from './foo.js'

window.self = null
export const App = {
  render() {
    window.self = this
    return h('div', {
      id: 'root',
      class: ['hello'],
      onClick() {
        console.log('i am click')
      },
      onText() {
        console.log(1)
      },
    },
    // `hi,${this.msg}`,
    // 'hi',
    // [
    //   h('div', {
    //     class: 'oo',
    //   },
    //   'children1',
    //   ),
    //   h('p', {
    //     class: 'oo',
    //   },
    //   '555',
    //   ),
    // ],
    [h('div', {}, 'hi'), h(Foo, { count: 1 })],
    )
  },

  setup() {
    return {
      msg: 'mini-vu33e',
    }
  },
}
