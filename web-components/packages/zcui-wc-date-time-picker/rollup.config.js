import babel from 'rollup-plugin-babel';
import babelRuntimeExternal from 'rollup-plugin-babel-runtime-external';
import { terser } from "rollup-plugin-terser";
import mergeFiles  from "./merge-files.js";


export default {
  input: './src/zcui-wc-date-time-picker.js',
  plugins: [
    mergeFiles(),
    babel(),
    terser(),
    babelRuntimeExternal({
      helpers: false,
      polyfill: true,
      regenerator: false,
    })],
  output: {
    file: './dist/bundle.min.js',
    format: 'iife'
  }
};