<?php
/**
 * Motion: scroll-reveal and hover effects for any block.
 *
 * - editor controls: build/extensions/motion/index.js (Motion panel);
 * - frontend: assets/motion.css (always, ~2KB) and build/extensions/motion/view.js
 *   (only on pages where a block uses motion).
 *
 * Saved markup only carries marker classes (mab-fx, mab-stagger, mab-hover) and
 * stays fully visible without JavaScript; the script adds the hidden state.
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
		$asset_file = BUILD_DIR . '/extensions/motion/index.asset.php';
		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;
		wp_enqueue_script(
			'mab-motion-editor',
			plugins_url( 'build/extensions/motion/index.js', __DIR__ ),
			$asset['dependencies'],
			$asset['version'],
			true
		);
	}
);

add_action(
	'enqueue_block_assets',
	static function (): void {
		$file = dirname( __DIR__ ) . '/assets/motion.css';
		if ( file_exists( $file ) ) {
			wp_enqueue_style(
				'mab-motion',
				plugins_url( 'assets/motion.css', __DIR__ ),
				array( 'mab-design' ),
				(string) filemtime( $file )
			);
		}
	},
	5
);

/**
 * Load the reveal script only when a rendered block asks for motion.
 *
 * @param string $content Rendered block HTML.
 */
add_filter(
	'render_block',
	static function ( $content ) {
		if ( is_admin() || ! is_string( $content ) ) {
			return $content;
		}
		if ( false !== strpos( $content, 'mab-fx' ) || false !== strpos( $content, 'mab-stagger' ) ) {
			$asset_file = BUILD_DIR . '/extensions/motion/view.asset.php';
			if ( file_exists( $asset_file ) && ! wp_script_is( 'mab-motion', 'enqueued' ) ) {
				$asset = require $asset_file;
				wp_enqueue_script(
					'mab-motion',
					plugins_url( 'build/extensions/motion/view.js', __DIR__ ),
					$asset['dependencies'],
					$asset['version'],
					array(
						'in_footer' => true,
						'strategy'  => 'defer',
					)
				);
			}
		}

		return $content;
	},
	10
);
