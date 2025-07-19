
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {

  const env = loadEnv(mode, process.cwd(), '');
  const base = command === 'build' && env.BUILD_TARGET === 'gh-pages'
    ? '/pixelworld/'
    : '/';

  return {
    base,
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2021'
      }
    },

    build: {
      target: 'es2020',
      outDir: 'docs',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main : "index.html",
          // notFound: "404.html",
          code: "code.html",
          monaco: "monaco.html"

        },
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        }
      }
    },
    server: {
      origin: 'http://localhost:5173',
    }
  }
})
