import { build } from "esbuild";
import fs from "node:fs/promises";

async function doBuild() {
  await build({
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
    outfile: "out/index.mjs",
  });

  await build({
    entryPoints: ["index.ts"],
    bundle: false,
    platform: "node",
    format: "cjs",
    metafile: false,
    write: true,
    minify: false,
    sourcemap: "external",
    logLevel: "error",
    target: ["node18", "es2020"],
    outfile: "out/index.cjs",
  });

  await build({
    entryPoints: ["harness.ts"],
    bundle: false,
    platform: "node",
    format: "cjs",
    metafile: false,
    write: true,
    minify: false,
    sourcemap: "external",
    logLevel: "error",
    target: ["node18", "es2020"],
    outfile: "out/harness.cjs",
  });

  // Now we need to replace the import statement in harness.ts to use the .cjs file, so we need to replace index.mjs with index.cjs
  const harnessContent = await fs.readFile("out/harness.cjs", "utf8");
  await fs.writeFile(
    "out/harness.cjs",
    harnessContent.replace(
      /import\("\.\/index\.mjs"\)/,
      'import("./index.cjs")'
    )
  );

  await build({
    entryPoints: ["harness.ts"],
    bundle: false,
    platform: "node",
    format: "esm",
    metafile: false,
    write: true,
    minify: false,
    sourcemap: "external",
    logLevel: "error",
    target: ["node18", "es2020"],
    outfile: "out/harness.mjs",
  });
}

doBuild().catch((err) => {
  console.error(err);
  process.exit(1);
});
