import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import babelRuntimeExternal from 'rollup-plugin-babel-runtime-external';


export default {
  input: './dist/bundle.js',
  plugins: [babel(), uglify(),
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