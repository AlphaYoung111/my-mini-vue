import App from './App.js'
import { createApp } from './render.js'
import { createRootContainer } from './game.js'

createApp(App).mount(createRootContainer())
