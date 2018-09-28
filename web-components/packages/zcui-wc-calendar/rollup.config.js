import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import babelRuntimeExternal from 'rollup-plugin-babel-runtime-external';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  input: './dist/bundle.js',
  plugin: [babel(), uglify(),serve(),livereload('dist'),
    babelRuntimeExternal({
      helpers: false,
      polyfill: true,
      regenerator: false,
    })],
  output: {
    file: './dist/bundle.min.js',
    format: 'iife'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers']
    }),
  ]
};