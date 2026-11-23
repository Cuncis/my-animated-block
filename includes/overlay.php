<?php
/**
 * "Overlay" option for Group and Section blocks.
 *
 * - the editor script adds the colour / opacity controls (build/extensions/overlay);
 * - assets/overlay.css paints the overlay in the editor canvas and on the frontend.
 *
 * @package MyAnimatedBlock
 */

declare( strict_types=1 );

namespace MyAnimatedBlock;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action(
	'enqueue_block_editor_assets',
	static function (): void {
		$asset_file = BUILD_DIR . '/extensions/overlay/index.asset.php';
		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;
		wp_enqueue_script(
			'mab-overlay',
			plugins_url( 'build/extensions/overlay/index.js', __DIR__ ),
			$asset['dependencies'],
			$asset['version'],
			true
		);
	}
);

/**
 * Loads on the frontend and inside the editor canvas.
 */
add_action(
	'enqueue_block_assets',
	static function (): void {
		$file = dirname( __DIR__ ) . '/assets/overlay.css';
		if ( ! file_exists( $file ) ) {
			return;
		}

		wp_enqueue_style(
			'mab-overlay',
			plugins_url( 'assets/overlay.css', __DIR__ ),
			array(),
			(string) filemtime( $file )
		);
	}
);
