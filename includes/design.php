<?php
/**
 * Settings > Design: per-project design tokens as CSS variables.
 *
 * Every project (company profile, shop, landing page) keeps the same plugin and
 * only changes these values: brand colours, fonts, corner radius and motion
 * defaults. Blocks, patterns and the motion extension read the variables, so
 * nothing in the plugin is tied to one site.
 *
 * @package MyAnimatedBlock
 */

declare( strict_types=1 );

namespace MyAnimatedBlock;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const DESIGN_OPTION = 'mab_design';

/**
 * Defaults, also used as the placeholder values on the settings page.
 *
 * @return array<string, string>
 */
function design_defaults(): array {
	return array(
		'primary'         => '#2563eb',
		'accent'          => '#7c3aed',
		'text'            => '#4b5563',
		'heading'         => '#111827',
		'surface'         => '#f3f4f6',
		'soft'            => '#f9fafb',
		'dark'            => '#111827',
		'border'          => '#e5e7eb',
		'font_body'       => '',
		'font_heading'    => '',
		'google_fonts'    => '1',
		'radius'          => '16',
		'motion_duration' => '900',
		'motion_distance' => '40',
	);
}

/**
 * Saved settings merged over the defaults.
 *
 * @return array<string, string>
 */
function design_settings(): array {
	$saved = get_option( DESIGN_OPTION, array() );

	return wp_parse_args( is_array( $saved ) ? $saved : array(), design_defaults() );
}

/**
 * Colour fields: key => label.
 *
 * @return array<string, string>
 */
function design_color_fields(): array {
	return array(
		'primary'  => __( 'Primary (buttons, highlights)', 'my-animated-block' ),
		'accent'   => __( 'Accent (links, labels)', 'my-animated-block' ),
		'text'     => __( 'Body text', 'my-animated-block' ),
		'heading'  => __( 'Headings', 'my-animated-block' ),
		'surface'  => __( 'Surface (cards, tabs)', 'my-animated-block' ),
		'soft'     => __( 'Soft background', 'my-animated-block' ),
		'dark'     => __( 'Dark background', 'my-animated-block' ),
		'border'   => __( 'Borders', 'my-animated-block' ),
	);
}

/**
 * Cleans the submitted values.
 *
 * @param mixed $input Raw submitted array.
 * @return array<string, string>
 */
function sanitize_design( $input ): array {
	$input    = is_array( $input ) ? $input : array();
	$defaults = design_defaults();
	$out      = array();

	foreach ( array_keys( design_color_fields() ) as $key ) {
		$color       = isset( $input[ $key ] ) ? sanitize_hex_color( (string) $input[ $key ] ) : '';
		$out[ $key ] = $color ? $color : $defaults[ $key ];
	}
	foreach ( array( 'font_body', 'font_heading' ) as $key ) {
		$out[ $key ] = isset( $input[ $key ] ) ? trim( (string) preg_replace( '/[^A-Za-z0-9 ]/', '', (string) $input[ $key ] ) ) : '';
	}
	$out['google_fonts']    = empty( $input['google_fonts'] ) ? '0' : '1';
	$out['radius']          = (string) max( 0, min( 64, (int) ( $input['radius'] ?? $defaults['radius'] ) ) );
	$out['motion_duration'] = (string) max( 100, min( 3000, (int) ( $input['motion_duration'] ?? $defaults['motion_duration'] ) ) );
	$out['motion_distance'] = (string) max( 0, min( 200, (int) ( $input['motion_distance'] ?? $defaults['motion_distance'] ) ) );

	return $out;
}

/**
 * The :root block of CSS variables.
 */
function design_css(): string {
	$s     = design_settings();
	$stack = static function ( string $font ): string {
		return '' === $font ? 'inherit' : '"' . $font . '", ui-sans-serif, system-ui, sans-serif';
	};

	$vars = array(
		'--mab-primary'         => $s['primary'],
		'--mab-accent'          => $s['accent'],
		'--mab-text'            => $s['text'],
		'--mab-heading'         => $s['heading'],
		'--mab-surface'         => $s['surface'],
		'--mab-soft'            => $s['soft'],
		'--mab-dark'            => $s['dark'],
		'--mab-border'          => $s['border'],
		'--mab-radius'          => (int) $s['radius'] . 'px',
		'--mab-radius-lg'       => ( (int) $s['radius'] + 8 ) . 'px',
		'--mab-font-body'       => $stack( $s['font_body'] ),
		'--mab-font-heading'    => $stack( '' !== $s['font_heading'] ? $s['font_heading'] : $s['font_body'] ),
		'--mab-motion-duration' => (int) $s['motion_duration'] . 'ms',
		'--mab-motion-distance' => (int) $s['motion_distance'] . 'px',
	);

	$css = ':root{';
	foreach ( $vars as $name => $value ) {
		$css .= $name . ':' . $value . ';';
	}

	return $css . '}';
}

/**
 * Google Fonts URL for the chosen families, or '' when disabled / none set.
 */
function design_fonts_url(): string {
	$s = design_settings();
	if ( '1' !== $s['google_fonts'] ) {
		return '';
	}

	$families = array_unique( array_filter( array( $s['font_body'], $s['font_heading'] ) ) );
	if ( ! $families ) {
		return '';
	}

	$parts = array();
	foreach ( $families as $family ) {
		$parts[] = 'family=' . str_replace( ' ', '+', $family ) . ':wght@300;400;500;600;700;800';
	}

	return 'https://fonts.googleapis.com/css2?' . implode( '&', $parts ) . '&display=swap';
}

/**
 * Frontend and editor canvas.
 */
add_action(
	'enqueue_block_assets',
	static function (): void {
		$fonts = design_fonts_url();
		if ( '' !== $fonts ) {
			wp_enqueue_style( 'mab-design-fonts', $fonts, array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- External font URL.
		}

		wp_register_style( 'mab-design', false, array(), null ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- Inline only.
		wp_enqueue_style( 'mab-design' );
		wp_add_inline_style( 'mab-design', design_css() );
	},
	1
);

/* ------------------------------------------------------------------------
 * Settings > Design
 * --------------------------------------------------------------------- */

add_action(
	'admin_init',
	static function (): void {
		register_setting(
			'mab_design_group',
			DESIGN_OPTION,
			array(
				'type'              => 'array',
				'sanitize_callback' => __NAMESPACE__ . '\\sanitize_design',
				'default'           => design_defaults(),
			)
		);
	}
);

add_action(
	'admin_menu',
	static function (): void {
		add_options_page(
			__( 'Design', 'my-animated-block' ),
			__( 'Design', 'my-animated-block' ),
			'manage_options',
			'mab-design',
			__NAMESPACE__ . '\\render_design_page'
		);
	}
);

add_action(
	'admin_enqueue_scripts',
	static function ( string $hook ): void {
		if ( 'settings_page_mab-design' === $hook ) {
			wp_enqueue_style( 'wp-components' );
		}
	}
);

function render_design_page(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$s = design_settings();
	$n = DESIGN_OPTION;
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Design', 'my-animated-block' ); ?></h1>
		<p><?php esc_html_e( 'Brand colours, fonts and motion for this site. Every My Animated Block block and pattern reads these values, so one plugin serves every project.', 'my-animated-block' ); ?></p>
		<form method="post" action="options.php">
			<?php settings_fields( 'mab_design_group' ); ?>
			<h2><?php esc_html_e( 'Colours', 'my-animated-block' ); ?></h2>
			<table class="form-table" role="presentation">
				<?php foreach ( design_color_fields() as $key => $label ) : ?>
					<tr>
						<th scope="row"><label for="mab-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></label></th>
						<td><input type="color" id="mab-<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $n ); ?>[<?php echo esc_attr( $key ); ?>]" value="<?php echo esc_attr( $s[ $key ] ); ?>" /> <code><?php echo esc_html( $s[ $key ] ); ?></code></td>
					</tr>
				<?php endforeach; ?>
			</table>

			<h2><?php esc_html_e( 'Typography and shape', 'my-animated-block' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="mab-font-body"><?php esc_html_e( 'Body font', 'my-animated-block' ); ?></label></th>
					<td><input type="text" class="regular-text" id="mab-font-body" name="<?php echo esc_attr( $n ); ?>[font_body]" value="<?php echo esc_attr( $s['font_body'] ); ?>" placeholder="Archivo" />
					<p class="description"><?php esc_html_e( 'A Google Fonts family name. Leave empty to inherit the theme font.', 'my-animated-block' ); ?></p></td>
				</tr>
				<tr>
					<th scope="row"><label for="mab-font-heading"><?php esc_html_e( 'Heading font', 'my-animated-block' ); ?></label></th>
					<td><input type="text" class="regular-text" id="mab-font-heading" name="<?php echo esc_attr( $n ); ?>[font_heading]" value="<?php echo esc_attr( $s['font_heading'] ); ?>" placeholder="<?php esc_attr_e( 'Same as body', 'my-animated-block' ); ?>" /></td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Load from Google Fonts', 'my-animated-block' ); ?></th>
					<td><label><input type="checkbox" name="<?php echo esc_attr( $n ); ?>[google_fonts]" value="1" <?php checked( '1', $s['google_fonts'] ); ?> /> <?php esc_html_e( 'Enqueue the fonts above from Google Fonts', 'my-animated-block' ); ?></label></td>
				</tr>
				<tr>
					<th scope="row"><label for="mab-radius"><?php esc_html_e( 'Corner radius (px)', 'my-animated-block' ); ?></label></th>
					<td><input type="number" min="0" max="64" id="mab-radius" name="<?php echo esc_attr( $n ); ?>[radius]" value="<?php echo esc_attr( $s['radius'] ); ?>" /></td>
				</tr>
			</table>

			<h2><?php esc_html_e( 'Motion defaults', 'my-animated-block' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><label for="mab-duration"><?php esc_html_e( 'Reveal duration (ms)', 'my-animated-block' ); ?></label></th>
					<td><input type="number" min="100" max="3000" step="50" id="mab-duration" name="<?php echo esc_attr( $n ); ?>[motion_duration]" value="<?php echo esc_attr( $s['motion_duration'] ); ?>" /></td>
				</tr>
				<tr>
					<th scope="row"><label for="mab-distance"><?php esc_html_e( 'Reveal distance (px)', 'my-animated-block' ); ?></label></th>
					<td><input type="number" min="0" max="200" id="mab-distance" name="<?php echo esc_attr( $n ); ?>[motion_distance]" value="<?php echo esc_attr( $s['motion_distance'] ); ?>" /></td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}
