import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import alias from '@rollup/plugin-alias'

const production = !process.env.ROLLUP_WATCH
const path = require('path').resolve(__dirname, 'src')
const svelteOptions = require('./svelte.config')

function serve() {
	let server

	function toExit() {
		if (server) server.kill(0)
	}

	return {
		writeBundle() {
			if (server) return
			server = require('child_process').spawn(
				'yarn',
				['run', 'start', '--', '--dev'],
				{
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true,
				}
			)

			process.on('SIGTERM', toExit)
			process.on('exit', toExit)
		},
	}
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js',
	},
	plugins: [
		alias({
			entries: [
				{ find: '@app', replacement: `${path}` },
				{ find: '@components', replacement: `${path}/components` },
				{ find: '@includes', replacement: `${path}/includes` },
				{ find: '@styles', replacement: `${path}/styles` },
				{ find: '@pages', replacement: `${path}/pages` },
			],
		}),
		svelte(svelteOptions),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		typescript({ sourceMap: !production }),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
}
