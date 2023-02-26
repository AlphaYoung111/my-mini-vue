import { h, ref } from '../../dist/mini-vue.es.js'

export const App = {
  name: 'App',
  setup() {
    const count = ref(0)

    const onClick = () => {
      count.value++
    }

    return {
      count,
      onClick,
    }
  },

  render() {
    return h('div', {
      id: 'root',
    }, [
      h('div', {}, `count: ${this.count}`),
      h('button', {
        onClick: this.onClick,
      }, 'click'),
    ])
  },
}
