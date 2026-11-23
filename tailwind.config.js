/** @type {import('tailwindcss').Config} */
module.exports = {
	// Every utility is emitted as `tw-*`, so it can never collide with
	// core/admin classes such as `.hidden`, `.flex` or `.button`.
	prefix: 'tw-',

	// Only the animated block uses Tailwind. Every other block ships
	// hand-written, dependency-free CSS, so scanning is limited to this one
	// folder to keep utilities out of the other blocks' stylesheets.
	content: [ './src/blocks/animated-block/**/*.{ts,tsx}' ],

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
