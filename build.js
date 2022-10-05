const { build } = require("esbuild");
build({
  entryPoints: ["./src/index.ts"],
  outfile: "./dist/ndmon-cjs.js",
  platform: "node",
  format: "cjs",
  minify: true,
  bundle: true,
  external: ["esbuild"],
});
