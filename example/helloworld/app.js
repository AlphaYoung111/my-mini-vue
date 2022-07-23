export const App = {
  render(h) {
    return h('div', `hi,${this.msg}`)
  },

  setup() {
    return {
      msg: 'mini-vue',
    }
  },
}
