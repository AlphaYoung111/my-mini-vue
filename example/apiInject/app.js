// 组件 provide 和 inject 功能
import {
  h,
  inject,
  provide,
} from '../../dist/mini-vue.es.js'

const Consumer = {
  name: 'Consumer',
  setup() {
    const foo = inject('foo')
    const bar = inject('bar')
    const baz = inject('baz', 'baz-default')
    return {
      foo,
      bar,
      baz,
    }
  },
  render() {
    return h('div', {}, `${this.foo}-${this.bar}-${this.baz}`)
  },
}

const ProviderTwo = {
  name: 'ProviderTwo',
  setup() {
    // override parent value
    provide('foo', 'fooOverride')
    // provide('baz', 'baz')
    const foo = inject('foo')
    // 这里获取的 foo 的值应该是 "foo"
    // 这个组件的子组件获取的 foo ，才应该是 fooOverride
    if (foo !== 'foo') {
      throw new Error('Foo should equal to foo')
    }
    return { foo }
    // return () => h(Consumer)
  },

  render() {
    return h('div', {}, [
      h('div', {}, `provide-tow:${this.foo}`),
      h(Consumer),
    ])
  },
}

const ProviderOne = {
  name: 'ProviderOne',
  setup() {
    provide('foo', 'foo')
    provide('bar', 'bar')
  },

  render() {
    return h('div', {}, [h('p', {}, 'Provideone'), h(ProviderTwo)])
  },
}

export const App = {
  name: 'App',
  setup() {

  },
  render() {
    return h('div', {}, [h('p', {}, 'apiInject'), h(ProviderOne)])
  },
}
