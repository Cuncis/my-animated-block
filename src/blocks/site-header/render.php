<?php
/**
 * Server render for the Site Header block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Unused.
 * @var WP_Block $block      Block instance.
 *
 * @package MyAnimatedBlock
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mab_menu_id = isset( $attributes['menuId'] ) ? absint( $attributes['menuId'] ) : 0;
$mab_sticky  = ! empty( $attributes['sticky'] );
$mab_cta     = isset( $attributes['ctaText'] ) ? trim( (string) $attributes['ctaText'] ) : '';
$mab_cta_url = isset( $attributes['ctaUrl'] ) ? (string) $attributes['ctaUrl'] : '';
$mab_logo_w  = isset( $attributes['logoWidth'] ) ? max( 40, min( 400, (int) $attributes['logoWidth'] ) ) : 140;

$mab_nav_id = wp_unique_id( 'mab-nav-' );

$mab_menu_args = array(
	'container'   => false,
	'menu_class'  => 'mab-header__menu',
	'depth'       => 3,
	'fallback_cb' => false,
	'echo'        => false,
);
if ( $mab_menu_id > 0 ) {
	$mab_menu_args['menu'] = $mab_menu_id;
} else {
	$mab_menu_args['theme_location'] = 'menu-1';
}
$mab_menu = wp_nav_menu( $mab_menu_args );

if ( has_custom_logo() ) {
	$mab_brand = get_custom_logo();
} else {
	$mab_brand = sprintf(
		'<a class="mab-header__title" href="%1$s" rel="home">%2$s</a>',
		esc_url( home_url( '/' ) ),
		esc_html( get_bloginfo( 'name' ) )
	);
}

$mab_wrapper = get_block_wrapper_attributes(
	array(
		'class' => 'mab-header' . ( $mab_sticky ? ' is-sticky' : '' ),
		'style' => '--mab-logo-w:' . $mab_logo_w . 'px',
	)
);
?>
<header <?php echo $mab_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built by core. ?>>
	<div class="mab-header__bar">
		<div class="mab-header__brand"><?php echo $mab_brand; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Core logo / escaped title. ?></div>

		<button type="button" class="mab-header__toggle" aria-expanded="false" aria-controls="<?php echo esc_attr( $mab_nav_id ); ?>" aria-label="<?php esc_attr_e( 'Toggle menu', 'my-animated-block' ); ?>">
			<span class="mab-header__burger" aria-hidden="true"></span>
		</button>

		<nav id="<?php echo esc_attr( $mab_nav_id ); ?>" class="mab-header__nav" aria-label="<?php esc_attr_e( 'Primary', 'my-animated-block' ); ?>">
			<?php echo $mab_menu ? $mab_menu : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output of wp_nav_menu(). ?>
			<?php if ( '' !== $mab_cta && '' !== $mab_cta_url ) : ?>
				<a class="mab-header__cta" href="<?php echo esc_url( $mab_cta_url ); ?>"><?php echo esc_html( $mab_cta ); ?></a>
			<?php endif; ?>
		</nav>
	</div>
</header>
