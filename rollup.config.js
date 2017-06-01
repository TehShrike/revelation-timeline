import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import svelte from 'rollup-plugin-svelte'

export default {
	format: 'iife',
	entry: 'client/index.js',
	dest: './public/bundle.js',
	plugins: [
		svelte(),
		resolve({
			browser: true
		}),
		commonjs(),
		babel({
			// exclude: 'node_modules/**',
			babelrc: false,
			presets: [
				[
					'es2015',
					{
						modules: false
					}
				]
			],
			plugins: [
				'external-helpers'
			]
		}),
	]
}
