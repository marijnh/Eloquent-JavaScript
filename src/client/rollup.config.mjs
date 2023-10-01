import {nodeResolve} from "@rollup/plugin-node-resolve"

export default {
  input: "src/client/index.mjs",
  output: {
    file: "html/ejs.js",
    format: "umd"
  },
  plugins: [nodeResolve()]
}
