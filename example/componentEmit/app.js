import { h } from '../../dist/mini-vue.es.js'
import { Foo } from './foo.js'

export const App = {
  setup() {
    return {}
  },

  render() {
    return h('div', {}, [
      h('div', {}, 'app'),
      h(Foo, {
        onAdd(p) {
          console.log('on add', p)
        },
        onAddFoo() {
          console.log('on add foo')
        },
      }),
    ])
  },

}
