import { build } from 'esbuild';
import pkg from './package.json' with { type: 'json' };

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * Author: ${pkg.author}
 * Website: ${pkg.homepage}
 */`;

build({
  entryPoints: ['lib/reactive-core.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'iife',              // ✅ Output as IIFE for browser use
  globalName: 'MicroUI',       // ✅ Accessible as window.MicroUI
  outfile: 'dist/magnumjs-micro-ui.js',
  banner: {
    js: banner,
  },
}).then(() => {
  console.log('Build completed with banner and exposed to window.MicroUI.');
}).catch(() => process.exit(1));
