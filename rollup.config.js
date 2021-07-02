import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';

const dev = process.env.ROLLUP_WATCH;

export default [
  {
    input: 'src/container-element.js',
    output: {
      dir: '.',
      format: 'es',
    },
    plugins: [
      nodeResolve({}),
      commonjs(),
      json(),
      babel({ exclude: 'node_modules/**' }),
      !dev && terser(),
      dev && serve({
        contentBase: ['./dist'],
        host: '0.0.0.0',
        port: 5000,
        allowCrossOrigin: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }),
    ],
  },
];
