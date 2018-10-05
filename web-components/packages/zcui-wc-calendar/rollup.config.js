import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import babelRuntimeExternal from 'rollup-plugin-babel-runtime-external';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import multiEntry from "rollup-plugin-multi-entry";

export default {
  input: [
    './dist/bundle-month-calendar.js',
    './dist/bundle-time-picker.js',
    './dist/bundle.js',
  ],
  output: {
    file: './dist/bundle-datetime-picker.min.js',
    format: 'iife'
  },
  plugins: [
    multiEntry(),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
  ]
};