import { h } from '../../dist/mini-vue.es.js'

window.self = null
export const App = {
  render() {
    window.self = this
    return h('div', {
      id: 'root',
      class: ['hello'],
    },
    `hi,${this.msg}`,
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
    )
  },

  setup() {
    return {
      msg: 'mini-vu33e',
    }
  },
}
