const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const { getWebpackEntryPoints } = require( '@wordpress/scripts/utils' );

// Default entries (every block.json) plus the editor extensions.
module.exports = {
	...defaultConfig,
	entry: async () => ( {
		...( await getWebpackEntryPoints( 'script' )() ),
		'extensions/overlay/index': path.resolve(
			__dirname,
			'src/extensions/overlay/index.tsx'
		),
	} ),
};
