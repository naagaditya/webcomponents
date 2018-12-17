import babel from 'rollup-plugin-babel';
import babelRuntimeExternal from 'rollup-plugin-babel-runtime-external';
import { terser } from "rollup-plugin-terser";



export default {
  input: './dist/bundle.js',
  plugins: [babel(), terser(),
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