import { createApp } from '../../dist/mini-vue.es.js'

import { App } from './app.js'

const containerElement = document.querySelector('#app')

createApp(App).mount(containerElement)
