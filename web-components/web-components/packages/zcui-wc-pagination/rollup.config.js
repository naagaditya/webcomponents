import babel from 'rollup-plugin-babel';
import babelRuntimeExternal from 'rollup-plugin-babel-runtime-external';
import { terser } from "rollup-plugin-terser";
import mergeFiles  from "./merge-files.js";
import html from 'rollup-plugin-html';
import multiEntry from "rollup-plugin-multi-entry";
import scss from 'rollup-plugin-scss';

const production = process.env.NODE_ENV == 'production';
const development = process.env.NODE_ENV == 'development';
let inputfiles = ['./src/zcui-wc-pagination.ejs', './src/zcui-wc-pagination.js', './src/zcui-wc-pagination.scss'];
if (production) {
  inputfiles = ['./dist/bundle.js'];
}
export default {
  input: inputfiles,
  plugins: [
    multiEntry(),
    html({
      include: '**/*.ejs'
    }),
    scss(),
    development && mergeFiles(),
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