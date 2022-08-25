import { BuildOptions } from "https://deno.land/x/dnt@0.30.0/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  compilerOptions: {
    lib: ["es2022"],
  },
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@schemaland/schema-js",
    version,
    description: "Universal, tiny schema for JavaScript data types",
    keywords: [
      "schema",
      "validate",
      "validator",
      "validation",
      "assert",
      "assertion",
      "javascript",
    ],
    license: "MIT",
    homepage: "https://github.com/schemaland/schema.js",
    repository: {
      type: "git",
      url: "git+https://github.com/schemaland/schema.js.git",
    },
    bugs: {
      url: "https://github.com/schemaland/schema.js/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: {
      access: "public",
    },
  },
  packageManager: "pnpm",
});
