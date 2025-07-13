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
  outfile: 'dist/magnumjs-micro-ui.js',
  banner: {
    js: banner,
  },
}).then(() => {
  console.log('Build completed with banner.');
}).catch(() => process.exit(1));
