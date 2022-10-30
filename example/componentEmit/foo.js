import { h } from '../../dist/mini-vue.es.js'

export const Foo = {
  setup(props, { emit }) {
    const emitAdd = () => {
      console.log('emit add')
      emit('add', 'params')
      emit('add-foo', 'params')
    }

    return {
      emitAdd,
    }
  },
  render() {
    const btn = h('button', {
      onClick: this.emitAdd,
    }, 'emitAdd')

    const foo = h('p', {}, 'foo')

    return h('div', {}, [
      foo,
      btn,
    ])
  },
}
