import { createTextNode, h } from '../../dist/mini-vue.es.js'
import { Foo } from './foo.js'

export const App = {
  setup() {
    return {}
  },

  render() {
    const app = h('div', {}, 'app')
    const foo = h(Foo, {}, {
      header: ({ age }) => [h('p', {}, `header${age}`), createTextNode('i am textnode')],
      footer: () => h('p', {}, 'footer'),
    })
    return h('div', {}, [app, foo])
  },

}
