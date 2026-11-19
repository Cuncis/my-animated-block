/** @type {import('tailwindcss').Config} */
module.exports = {
	// Every utility is emitted as `tw-*`, so it can never collide with
	// core/admin classes such as `.hidden`, `.flex` or `.button`.
	prefix: 'tw-',

	// Only scan this block's source. Nothing outside src/ can add utilities
	// to the bundle, which keeps the generated CSS small and predictable.
	content: [ './src/**/*.{ts,tsx}' ],

	corePlugins: {
		// Preflight is a global CSS reset (h1, button, img, ...). Loaded in
		// wp-admin or on a theme, it would restyle everything on the page.
		preflight: false,
	},

	theme: {
		extend: {},
	},

	plugins: [],
};
