import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'
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
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
