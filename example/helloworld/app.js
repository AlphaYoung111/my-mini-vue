import { h } from '../../dist/mini-vue.es.js'

export const App = {
  render() {
    return h('div', `hi,${this.msg}`)
  },

  setup() {
    return {
      msg: 'mini-vue',
    }
  },
}
