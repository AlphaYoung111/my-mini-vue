import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  test:{

  },
  plugins: [
    AutoImport({
      imports:[
        'vitest'
      ],
      dts:'../auto-import.d.ts'
    })
  ]
})
