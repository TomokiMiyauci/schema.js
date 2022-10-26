import { BuildOptions } from "https://deno.land/x/dnt@0.31.0/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  compilerOptions: { lib: ["es2022"] },
  package: {
    name: "type-struct",
    version,
    description:
      "Composable and checkable JavaScript(and TypeScript) data structure",
    keywords: [
      "struct",
      "structure",
      "check",
      "checker",
      "validate",
      "validator",
      "assert",
      "assertion",
      "is",
      "data",
      "valid",
      "invalid",
      "error",
      "schema",
    ],
    license: "MIT",
    homepage: "https://github.com/TomokiMiyauci/typestruct",
    repository: {
      type: "git",
      url: "git+https://github.com/TomokiMiyauci/typestruct.git",
    },
    bugs: {
      url: "https://github.com/TomokiMiyauci/typestruct/issues",
    },
    sideEffects: false,
    type: "module",
    devDependencies: {
      "@types/node": "^18",
    },
  },
  packageManager: "pnpm",
  mappings: {
    "https://deno.land/x/isx@1.0.0-beta.23/mod.ts": {
      name: "isxx",
      version: "1.0.0-beta.23",
    },
  },
});
