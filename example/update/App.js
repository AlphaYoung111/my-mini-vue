import { h, ref } from '../../dist/mini-vue.es.js'

export const App = {
  name: 'App',
  setup() {
    const count = ref(0)

    const onClick = () => {
      count.value++
    }

    const props = ref({
      foo: 'foo',
      bar: 'bar',
    })

    const changPropsDemo1 = () => {
      props.value.foo = 'new-foo'
      console.log('000')
    }

    const changPropsDemo2 = () => {
      props.value.foo = undefined
    }

    const changPropsDemo3 = () => {
      props.value = {
        foo: 'foo',
      }
    }

    return {
      count,
      onClick,

      props,
      changPropsDemo1,
      changPropsDemo2,
      changPropsDemo3,
    }
  },

  render() {
    return h('div', {
      id: 'root',
      ...this.props,
    },
    [
      h('div', {}, `count: ${this.count}`),
      h('button', {
        onClick: this.onClick,
      }, 'click'),

      h('button', { onClick: this.changPropsDemo1 }, 'changPropsDemo1'),
      h('button', { onClick: this.changPropsDemo2 }, 'changPropsDemo2'),
      h('button', { onClick: this.changPropsDemo3 }, 'changPropsDemo3'),

    ],
    )
  },
}
