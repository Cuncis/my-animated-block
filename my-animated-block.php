<?php
/**
 * Plugin Name:       My Animated Block
 * Description:       A lightweight block library for building whole sites without a page builder: Hero, Section, Feature Grid, CTA Banner, Testimonials, FAQ, Pricing Table, Contact Form, Tabs, Stats, Logo Carousel, Team, Lightbox, Map, Site Header, Post Grid and a GSAP Animated Block.
 * Version:           1.4.0
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

require_once __DIR__ . '/includes/contact-form.php';
require_once __DIR__ . '/includes/site-layout.php';

/**
 * Registers every block found in build/blocks/<name>/block.json.
 *
 * Each block declares its own assets (editorScript, editorStyle, style,
 * viewScript, render) in block.json, so WordPress registers the handles,
 * reads the generated *.asset.php files, and enqueues a block's frontend
 * assets only on pages that actually contain that block. No manual
 * wp_enqueue_* calls are needed (or wanted) here.
 */
function register_blocks(): void {
	$manifests = glob( BUILD_DIR . '/blocks/*/block.json' );

	if ( empty( $manifests ) ) {
		add_action( 'admin_notices', __NAMESPACE__ . '\\render_missing_build_notice' );
		return;
	}

	foreach ( $manifests as $manifest ) {
		register_block_type( dirname( $manifest ) );
	}
}
add_action( 'init', __NAMESPACE__ . '\\register_blocks' );

/**
 * Adds a "Site Blocks" category to the block inserter.
 *
 * @param array<int, array<string, string>> $categories Existing categories.
 * @return array<int, array<string, string>>
 */
function register_block_category( array $categories ): array {
	array_unshift(
		$categories,
		array(
			'slug'  => 'mab-site',
			'title' => __( 'Site Blocks', 'my-animated-block' ),
		)
	);

	return $categories;
}
add_filter( 'block_categories_all', __NAMESPACE__ . '\\register_block_category' );

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
