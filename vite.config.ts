import path, { resolve } from 'path'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
export default defineConfig({
  test: {

  },
  plugins: [
    AutoImport({
      imports: [
        'vitest',
      ],
      dts: '../auto-import.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MiniVue',
      // the proper extensions will be added
      fileName: 'mini-vue',
    },
    // rollupOptions: {
    //   input: './src/index.ts',
    //   output: [
    //     // ejs => commonjs
    //     // esm
    //     {
    //       format: 'cjs',
    //       file: 'lib/guide-mini-vue.ejs.js',
    //     },
    //     {
    //       format: 'es',
    //       file: 'lib/guide-mini-vue.esm.js',
    //     },
    //   ],
    // },
  },
})
