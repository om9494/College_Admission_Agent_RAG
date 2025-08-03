import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect';
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import { visualizer } from 'rollup-plugin-visualizer';


// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      // Enable esbuild plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  resolve: {
    alias: {
      // Alias to polyfill Node.js core modules
      path: "path-browserify",
      stream: "stream-browserify",
    },
  },
  plugins: [
    react(),
    Inspect(),
    visualizer(),
    NodeGlobalsPolyfillPlugin({
      process: true,
      buffer: true,
    }),
  ],
  build: {
    rollupOptions: {
      external: ['./@google/generative-ai'],
      target: 'es2020',
      output: {
        manualChunks: {
        }
      }
    },
    minify: 'terser',
  },
})
