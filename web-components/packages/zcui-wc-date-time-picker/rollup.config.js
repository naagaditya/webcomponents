import babel from 'rollup-plugin-babel';
import babelRuntimeExternal from 'rollup-plugin-babel-runtime-external';
import { terser } from "rollup-plugin-terser";
import mergeFiles  from "./merge-files.js";
import html from 'rollup-plugin-html';
import multiEntry from "rollup-plugin-multi-entry";
import scss from 'rollup-plugin-scss'


export default {
  input: ['./src/zcui-wc-date-time-picker.ejs', './src/zcui-wc-date-time-picker.js', './src/zcui-wc-date-time-picker.scss'],
  plugins: [
    multiEntry(),
    html({
      include: '**/*.ejs'
    }),
    scss(),
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
    format: 'iife',
    name: 'output'
  }
};