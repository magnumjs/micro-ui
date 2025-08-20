import { build } from "esbuild";
import pkg from "./package.json" with { type: "json" };

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * Author: ${pkg.author}
 * Website: ${pkg.homepage}
 */`;

const builds = [
  {
    entry: "lib/reactive-core.js",
    formats: [
      { format: "esm", outfile: "dist/magnumjs-micro-ui.esm.js" },
      { format: "iife", outfile: "dist/magnumjs-micro-ui.js", globalName: "MicroUI" },
    ],
  },
  {
    entry: "lib/compose/context.js",
    formats: [
      { format: "esm", outfile: "dist/magnumjs-micro-ui-context.esm.js" },
      { format: "iife", outfile: "dist/magnumjs-micro-ui-context.js", globalName: "MicroUIContext" },
    ],
  },
  {
    entry: "lib/compose/reactive-composables.js",
    formats: [
      { format: "esm", outfile: "dist/magnumjs-micro-ui-compose.esm.js" },
      { format: "iife", outfile: "dist/magnumjs-micro-ui-compose.js", globalName: "MicroUICompose" },
    ],
  },
  {
    entry: "lib/hooks/index.js",
    formats: [
      { format: "esm", outfile: "dist/magnumjs-micro-ui-hooks.esm.js" },
      { format: "iife", outfile: "dist/magnumjs-micro-ui-hooks.js", globalName: "MicroUIHooks" },
    ],
  },
];

async function runBuild() {
  for (const { entry, formats } of builds) {
    for (const opts of formats) {
      await build({
        entryPoints: [entry],
        bundle: true,
        minify: true,
        sourcemap: true,
        format: opts.format,
        outfile: opts.outfile,
        globalName: opts.globalName,
        define: { "process.env.APP_VERSION": JSON.stringify(pkg.version) },
        banner: { js: banner },
      });
    }
  }
  console.log("✅ Build completed: core + context");
}

runBuild().catch(() => process.exit(1));
