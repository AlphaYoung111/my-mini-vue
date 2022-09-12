import { h } from '../../dist/mini-vue.es.js'

export const App = {
  render() {
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
