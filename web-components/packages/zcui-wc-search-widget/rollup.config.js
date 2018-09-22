import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
export default {
  input: './dist/bundle.js',
  plugin: [babel(), uglify()],
  output: {
    file: './dist/bundle.min.js',
    format: 'iife'
  }
};