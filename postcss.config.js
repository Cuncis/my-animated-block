// When this file exists, @wordpress/scripts uses it instead of its built-in
// PostCSS preset, which is how Tailwind gets into the build pipeline.
module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
	},
};
