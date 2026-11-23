<?php
/**
 * Site layout for Hello Elementor without Elementor:
 *  - "Full Width" and "Canvas" page templates;
 *  - Settings > Site Layout: choose a page or synced pattern to use as the
 *    site-wide header and/or footer, and optionally hide the page title.
 *
 * Hello Elementor has one switch for both header and footer
 * (the "hello_elementor_header_footer" filter). When a custom header or
 * footer is chosen we turn the theme's off and print both parts ourselves,
 * falling back to the theme's own markup for whichever one was not chosen,
 * so nothing disappears.
 *
 * @package MyAnimatedBlock
 */

declare( strict_types=1 );

namespace MyAnimatedBlock;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const TEMPLATE_FULL   = 'mab-full-width';
const TEMPLATE_CANVAS = 'mab-canvas';

/* -------------------------------------------------------------------------
 * Page templates
 * ---------------------------------------------------------------------- */

/**
 * Templates this plugin adds, keyed by slug.
 *
 * @return array<string, string>
 */
function layout_templates(): array {
	return array(
		TEMPLATE_FULL   => __( 'Full Width (Site Blocks)', 'my-animated-block' ),
		TEMPLATE_CANVAS => __( 'Canvas: no header or footer (Site Blocks)', 'my-animated-block' ),
	);
}

/**
 * Adds the templates to the Template dropdown.
 *
 * @param array<string, string> $templates Existing templates.
 * @return array<string, string>
 */
function register_layout_templates( array $templates ): array {
	return array_merge( $templates, layout_templates() );
}
add_filter( 'theme_page_templates', __NAMESPACE__ . '\\register_layout_templates' );
add_filter( 'theme_post_templates', __NAMESPACE__ . '\\register_layout_templates' );

/**
 * The layout template chosen for the current singular post, or ''.
 */
function current_layout(): string {
	if ( ! is_singular() ) {
		return '';
	}

	$slug = get_page_template_slug();

	return is_string( $slug ) && isset( layout_templates()[ $slug ] ) ? $slug : '';
}

add_filter(
	'template_include',
	static function ( $template ) {
		$layout = current_layout();

		if ( TEMPLATE_FULL === $layout ) {
			return dirname( __DIR__ ) . '/templates/full-width.php';
		}
		if ( TEMPLATE_CANVAS === $layout ) {
			return dirname( __DIR__ ) . '/templates/canvas.php';
		}

		return $template;
	},
	99
);

add_filter(
	'body_class',
	static function ( $classes ) {
		$layout = current_layout();
		if ( TEMPLATE_FULL === $layout ) {
			$classes[] = 'mab-layout-full';
		} elseif ( TEMPLATE_CANVAS === $layout ) {
			$classes[] = 'mab-layout-canvas';
		}

		return $classes;
	}
);

add_action(
	'wp_enqueue_scripts',
	static function (): void {
		if ( '' === current_layout() ) {
			return;
		}

		$file = dirname( __DIR__ ) . '/assets/layout.css';
		wp_enqueue_style(
			'mab-layout',
			plugins_url( 'assets/layout.css', dirname( __DIR__ ) . '/my-animated-block.php' ),
			array(),
			file_exists( $file ) ? (string) filemtime( $file ) : null
		);
	}
);

/* -------------------------------------------------------------------------
 * Site-wide header / footer
 * ---------------------------------------------------------------------- */

/**
 * The layout code only takes over when Hello Elementor is the active theme
 * (or its parent), because it relies on that theme's hooks and templates.
 */
function is_hello_theme(): bool {
	return 'hello-elementor' === get_template();
}

/**
 * ID of the page / synced pattern chosen for "header" or "footer", or 0.
 *
 * @param string $part header|footer.
 */
function layout_part_id( string $part ): int {
	$id = (int) get_option( 'mab_layout_' . $part, 0 );
	if ( $id <= 0 ) {
		return 0;
	}

	$post = get_post( $id );

	return (
		$post instanceof \WP_Post
		&& 'publish' === $post->post_status
		&& in_array( $post->post_type, array( 'page', 'wp_block' ), true )
		&& '' === $post->post_password
	) ? $id : 0;
}

/**
 * Renders a chosen page / synced pattern to HTML.
 *
 * @param int $id Post ID.
 */
function render_layout_part( int $id ): string {
	static $rendering = array();

	$post = get_post( $id );
	if ( ! $post instanceof \WP_Post || isset( $rendering[ $id ] ) ) {
		return '';
	}

	$rendering[ $id ] = true;
	$html             = 'wp_block' === $post->post_type
		? do_blocks( '<!-- wp:block {"ref":' . $id . '} /-->' )
		: do_blocks( $post->post_content );
	unset( $rendering[ $id ] );

	return $html;
}

add_filter(
	'hello_elementor_header_footer',
	static function ( $show ) {
		if ( is_hello_theme() && ( layout_part_id( 'header' ) || layout_part_id( 'footer' ) ) ) {
			return false;
		}

		return $show;
	}
);

add_filter(
	'hello_elementor_page_title',
	static function ( $show ) {
		return get_option( 'mab_layout_hide_title' ) ? false : $show;
	}
);

add_action(
	'wp_body_open',
	static function (): void {
		if ( ! is_hello_theme() || TEMPLATE_CANVAS === current_layout() ) {
			return;
		}

		$header = layout_part_id( 'header' );
		if ( ! $header && ! layout_part_id( 'footer' ) ) {
			return; // Nothing customised: the theme prints its own header.
		}

		if ( $header ) {
			echo render_layout_part( $header ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered blocks.
		} else {
			get_template_part( 'template-parts/header' ); // Keep the theme's header.
		}
	},
	20
);

add_action(
	'wp_footer',
	static function (): void {
		if ( ! is_hello_theme() || TEMPLATE_CANVAS === current_layout() ) {
			return;
		}

		$footer = layout_part_id( 'footer' );
		if ( ! $footer && ! layout_part_id( 'header' ) ) {
			return;
		}

		if ( $footer ) {
			echo render_layout_part( $footer ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered blocks.
		} else {
			get_template_part( 'template-parts/footer' ); // Keep the theme's footer.
		}
	},
	1
);

/* -------------------------------------------------------------------------
 * Settings > Site Layout
 * ---------------------------------------------------------------------- */

/**
 * Accepts 0 (none) or the ID of a published page / synced pattern.
 *
 * @param mixed $value Submitted value.
 */
function sanitize_layout_part( $value ): int {
	$id = absint( $value );
	if ( ! $id ) {
		return 0;
	}

	$post = get_post( $id );

	return (
		$post instanceof \WP_Post
		&& 'publish' === $post->post_status
		&& in_array( $post->post_type, array( 'page', 'wp_block' ), true )
	) ? $id : 0;
}

add_action(
	'admin_init',
	static function (): void {
		foreach ( array( 'mab_layout_header', 'mab_layout_footer' ) as $option ) {
			register_setting(
				'mab_layout',
				$option,
				array(
					'type'              => 'integer',
					'sanitize_callback' => __NAMESPACE__ . '\\sanitize_layout_part',
					'default'           => 0,
				)
			);
		}

		register_setting(
			'mab_layout',
			'mab_layout_hide_title',
			array(
				'type'              => 'boolean',
				'sanitize_callback' => 'rest_sanitize_boolean',
				'default'           => false,
			)
		);
	}
);

add_action(
	'admin_menu',
	static function (): void {
		add_options_page(
			__( 'Site Layout', 'my-animated-block' ),
			__( 'Site Layout', 'my-animated-block' ),
			'manage_options',
			'mab-site-layout',
			__NAMESPACE__ . '\\render_layout_settings'
		);
	}
);

/**
 * Prints a <select> of pages and synced patterns.
 *
 * @param string $name     Option / field name.
 * @param int    $selected Selected post ID.
 */
function print_source_select( string $name, int $selected ): void {
	$groups = array(
		'wp_block' => __( 'Patterns (synced)', 'my-animated-block' ),
		'page'     => __( 'Pages', 'my-animated-block' ),
	);

	printf( '<select name="%1$s" id="%1$s">', esc_attr( $name ) );
	printf( '<option value="0">%s</option>', esc_html__( '— Theme default —', 'my-animated-block' ) );

	foreach ( $groups as $type => $label ) {
		$posts = get_posts(
			array(
				'post_type'      => $type,
				'post_status'    => 'publish',
				'posts_per_page' => 200,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'no_found_rows'  => true,
			)
		);
		if ( array() === $posts ) {
			continue;
		}

		printf( '<optgroup label="%s">', esc_attr( $label ) );
		foreach ( $posts as $post ) {
			printf(
				'<option value="%1$d"%2$s>%3$s</option>',
				(int) $post->ID,
				selected( $selected, $post->ID, false ),
				esc_html( '' !== $post->post_title ? $post->post_title : __( '(no title)', 'my-animated-block' ) )
			);
		}
		echo '</optgroup>';
	}

	echo '</select>';
}

/**
 * Renders the settings page.
 */
function render_layout_settings(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$header = layout_part_id( 'header' );
	$footer = layout_part_id( 'footer' );

	// phpcs:disable WordPress.Security.NonceVerification.Recommended -- Display-only notice flag.
	$notice = isset( $_GET['mab_notice'] ) ? sanitize_key( wp_unslash( $_GET['mab_notice'] ) ) : '';
	// phpcs:enable WordPress.Security.NonceVerification.Recommended
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Site Layout', 'my-animated-block' ); ?></h1>

		<?php if ( 'created' === $notice ) : ?>
			<div class="notice notice-success is-dismissible"><p><?php esc_html_e( 'Starter part created and selected below. Edit it in the block editor, then save.', 'my-animated-block' ); ?></p></div>
		<?php endif; ?>

		<?php if ( ! is_hello_theme() ) : ?>
			<div class="notice notice-warning"><p><?php esc_html_e( 'The custom header and footer only work with the Hello Elementor theme. The page templates work with any theme.', 'my-animated-block' ); ?></p></div>
		<?php endif; ?>

		<p><?php esc_html_e( 'Build your header and footer as a synced pattern (or a page) from the block editor, for example with the Site Header block, then choose it here. It replaces the theme header or footer on every page. Leave a field on "Theme default" to keep the theme version of that part.', 'my-animated-block' ); ?></p>

		<form method="post" action="options.php">
			<?php settings_fields( 'mab_layout' ); ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="mab_layout_header"><?php esc_html_e( 'Header', 'my-animated-block' ); ?></label></th>
					<td>
						<?php print_source_select( 'mab_layout_header', $header ); ?>
						<?php if ( $header ) : ?>
							<?php $link = get_edit_post_link( $header ); ?>
							<?php if ( $link ) : ?>
								<a href="<?php echo esc_url( $link ); ?>"><?php esc_html_e( 'Edit', 'my-animated-block' ); ?></a>
							<?php endif; ?>
						<?php endif; ?>
					</td>
				</tr>
				<tr>
					<th scope="row"><label for="mab_layout_footer"><?php esc_html_e( 'Footer', 'my-animated-block' ); ?></label></th>
					<td>
						<?php print_source_select( 'mab_layout_footer', $footer ); ?>
						<?php if ( $footer ) : ?>
							<?php $link = get_edit_post_link( $footer ); ?>
							<?php if ( $link ) : ?>
								<a href="<?php echo esc_url( $link ); ?>"><?php esc_html_e( 'Edit', 'my-animated-block' ); ?></a>
							<?php endif; ?>
						<?php endif; ?>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Page title', 'my-animated-block' ); ?></th>
					<td>
						<label>
							<input type="hidden" name="mab_layout_hide_title" value="0" />
							<input type="checkbox" name="mab_layout_hide_title" value="1" <?php checked( (bool) get_option( 'mab_layout_hide_title' ) ); ?> />
							<?php esc_html_e( 'Hide the theme\'s page title on pages and posts', 'my-animated-block' ); ?>
						</label>
					</td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>

		<hr />
		<h2><?php esc_html_e( 'Starter parts', 'my-animated-block' ); ?></h2>
		<p><?php esc_html_e( 'Create a ready-made header or footer pattern and select it automatically. This changes your whole site, so only do it when you are ready.', 'my-animated-block' ); ?></p>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline-block;margin-right:.5rem">
			<input type="hidden" name="action" value="mab_layout_starter" />
			<input type="hidden" name="part" value="header" />
			<?php wp_nonce_field( 'mab_layout_starter' ); ?>
			<?php submit_button( __( 'Create starter header', 'my-animated-block' ), 'secondary', 'submit', false ); ?>
		</form>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline-block">
			<input type="hidden" name="action" value="mab_layout_starter" />
			<input type="hidden" name="part" value="footer" />
			<?php wp_nonce_field( 'mab_layout_starter' ); ?>
			<?php submit_button( __( 'Create starter footer', 'my-animated-block' ), 'secondary', 'submit', false ); ?>
		</form>
	</div>
	<?php
}

/**
 * Markup for the starter header / footer patterns.
 *
 * @param string $part header|footer.
 */
function starter_content( string $part ): string {
	if ( 'header' === $part ) {
		return '<!-- wp:my-animated-block/site-header {"ctaText":"Get started","ctaUrl":"#contact"} /-->';
	}

	$text = sprintf(
		/* translators: 1: year, 2: site name */
		__( '© %1$s %2$s. All rights reserved.', 'my-animated-block' ),
		gmdate( 'Y' ),
		wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES )
	);

	return '<!-- wp:my-animated-block/section {"spacing":"md","style":{"color":{"text":"#ffffff","background":"#111827"}}} -->'
		. '<section class="wp-block-my-animated-block-section mab-section mab-section--space-md alignfull has-text-color has-background" style="color:#ffffff;background-color:#111827">'
		. '<div class="mab-section__inner mab-section__inner--default">'
		. '<!-- wp:paragraph {"align":"center"} --><p class="has-text-align-center">' . esc_html( $text ) . '</p><!-- /wp:paragraph -->'
		. '</div></section><!-- /wp:my-animated-block/section -->';
}

add_action(
	'admin_post_mab_layout_starter',
	static function (): void {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'my-animated-block' ), 403 );
		}
		check_admin_referer( 'mab_layout_starter' );

		$part = isset( $_POST['part'] ) && 'footer' === $_POST['part'] ? 'footer' : 'header';

		$id = wp_insert_post(
			array(
				'post_type'    => 'wp_block',
				'post_status'  => 'publish',
				'post_title'   => 'header' === $part
					? __( 'Site Header', 'my-animated-block' )
					: __( 'Site Footer', 'my-animated-block' ),
				'post_content' => starter_content( $part ),
			),
			true
		);

		if ( ! is_wp_error( $id ) ) {
			update_option( 'mab_layout_' . $part, (int) $id );
		}

		wp_safe_redirect(
			add_query_arg(
				array(
					'page'       => 'mab-site-layout',
					'mab_notice' => is_wp_error( $id ) ? 'failed' : 'created',
				),
				admin_url( 'options-general.php' )
			)
		);
		exit;
	}
);
