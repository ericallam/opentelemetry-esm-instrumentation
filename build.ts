import { build } from "esbuild";

async function doBuild() {
  const result = await build({
    entryPoints: ["index.ts"],
    bundle: false,
    platform: "node",
    format: "esm",
    metafile: false,
    write: true,
    minify: false,
    sourcemap: "external",
    logLevel: "error",
    target: ["node18", "es2020"],
    outdir: "out",
  });
}

doBuild().catch((err) => {
  console.error(err);
  process.exit(1);
});
