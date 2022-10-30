import { h } from '../../dist/mini-vue.es.js'

export const Foo = {
  setup(props) {
    console.log(props)
    props.count++
  },
  render() {
    return h('div', {}, `foo: ${this.count}`)
  },
}
