import { h, renderSlots } from '../../dist/mini-vue.es.js'

export const Foo = {
  setup(props) {
    return {}
  },
  render() {
    const foo = h('p', {}, 'foo inside')
    console.log(this.$slots)
    return h('div', {}, [
      renderSlots(this.$slots, 'header', {
        age: 18,
      }),
      foo,
      renderSlots(this.$slots, 'footer'),
    ])
  },
}
