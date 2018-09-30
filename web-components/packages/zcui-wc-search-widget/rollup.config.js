import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import babelRuntimeExternal from 'rollup-plugin-babel-runtime-external';


export default {
  input: './dist/bundle.js',
  plugins: [babel(),
    babelRuntimeExternal({
      helpers: false,
      polyfill: true,
      regenerator: true,
    })],
  output: {
    file: './dist/bundle.min.js',
    format: 'iife'
  }

};