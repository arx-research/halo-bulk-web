import esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

esbuild
  .context({
    entryPoints: ['src/scripts.js', 'src/style.scss'],
    bundle: true,
    sourcemap: true,
    external: ['*.woff'],
    outdir: 'dist/assets',
    plugins: [sassPlugin({})],
    minify: process.argv.includes('--minify'),
  })
  .then((context) => {
    if (process.argv.includes('--watch')) {
      // Enable watch mode
      context.watch()
    } else {
      // Build once and exit if not in watch mode
      context.rebuild().then((result) => {
        context.dispose()
      })
    }
  })
  .catch(() => process.exit(1))