import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
    },
    plugins: [typescript({ useTsconfigDeclarationDir: true, clean: true }), resolve()],
    // indicate which modules should be treated as external
    external: ["react"],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.m.js",
      format: "cjs",
      exports: "default",
    },
    plugins: [typescript({ useTsconfigDeclarationDir: true, clean: true }), resolve()],
    // indicate which modules should be treated as external
    external: ["react"],
  },
  {
    input: "./src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
