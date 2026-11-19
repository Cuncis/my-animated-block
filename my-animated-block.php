<?php
/**
 * Plugin Name:       My Animated Block
 * Description:       A Gutenberg block with GSAP-powered entrance animations, built with React, TypeScript and Tailwind CSS.
 * Version:           1.0.0
 * Requires at least: 6.5
 * Requires PHP:      7.4
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       my-animated-block
 *
 * @package MyAnimatedBlock
 */

declare( strict_types=1 );

namespace MyAnimatedBlock;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const BUILD_DIR = __DIR__ . '/build';

/**
 * Registers the block from the compiled build/block.json.
 *
 * Every asset (editorScript, editorStyle, style, viewScript) is declared in
 * block.json, so WordPress registers the handles, reads the generated
 * *.asset.php dependency/version files, wires up script translations and
 * enqueues the frontend assets only on pages that actually contain the block.
 * No manual wp_enqueue_* calls are needed (or wanted) here.
 */
function register_block(): void {
	if ( ! file_exists( BUILD_DIR . '/block.json' ) ) {
		add_action( 'admin_notices', __NAMESPACE__ . '\\render_missing_build_notice' );
		return;
	}

	register_block_type( BUILD_DIR );
}
add_action( 'init', __NAMESPACE__ . '\\register_block' );

/**
 * Shows an admin notice when the plugin is active but has not been built yet.
 */
function render_missing_build_notice(): void {
	if ( ! current_user_can( 'activate_plugins' ) ) {
		return;
	}

	printf(
		'<div class="notice notice-error"><p>%s</p></div>',
		esc_html__(
			'My Animated Block: build files are missing. Run "npm install && npm run build" in the plugin directory.',
			'my-animated-block'
		)
	);
}
