const sveltePreprocess = require('svelte-preprocess')
const typescript = require('./tsconfig.json')
const production = !process.env.ROLLUP_WATCH

module.exports = {
	// enable run-time checks when not in production
	dev: !production,
	// we'll extract any component CSS out into
	// a separate file - better for performance
	css: (css) => {
		css.write('public/build/bundle.css')
	},
	preprocess: sveltePreprocess({
		scss: { includePaths: ['src'] },
		postcss: {
			plugins: [require('autoprefixer')],
		},
		typescript,
	}),
}
