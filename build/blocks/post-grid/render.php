<?php
/**
 * Server render for the Post Grid block.
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

$mab_count   = isset( $attributes['count'] ) ? max( 1, min( 24, (int) $attributes['count'] ) ) : 6;
$mab_cols    = isset( $attributes['columns'] ) ? max( 1, min( 4, (int) $attributes['columns'] ) ) : 3;
$mab_cat_ids = isset( $attributes['categoryIds'] ) && is_array( $attributes['categoryIds'] )
	? array_values( array_filter( array_map( 'absint', $attributes['categoryIds'] ) ) )
	: array();
$mab_words   = isset( $attributes['excerptLength'] ) ? max( 5, min( 60, (int) $attributes['excerptLength'] ) ) : 20;

$mab_filters = ! empty( $attributes['showFilters'] );
$mab_image   = ! empty( $attributes['showImage'] );
$mab_date    = ! empty( $attributes['showDate'] );
$mab_excerpt = ! empty( $attributes['showExcerpt'] );

$mab_args = array(
	'post_type'           => 'post',
	'post_status'         => 'publish',
	'posts_per_page'      => $mab_count,
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
);
if ( array() !== $mab_cat_ids ) {
	$mab_args['category__in'] = $mab_cat_ids;
}

$mab_query = new WP_Query( $mab_args );

$mab_wrapper = get_block_wrapper_attributes( array( 'class' => 'mab-posts mab-posts--cols-' . $mab_cols ) );

if ( ! $mab_query->have_posts() ) {
	printf(
		'<div %1$s><p class="mab-posts__empty">%2$s</p></div>',
		$mab_wrapper, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built by core.
		esc_html__( 'No posts found.', 'my-animated-block' )
	);
	return;
}

// Collect the categories that actually appear, for the filter buttons.
$mab_cards = array();
$mab_terms = array();

while ( $mab_query->have_posts() ) {
	$mab_query->the_post();
	$mab_post_id = get_the_ID();
	$mab_slugs   = array();

	foreach ( (array) get_the_category( $mab_post_id ) as $mab_term ) {
		$mab_slugs[]                       = $mab_term->slug;
		$mab_terms[ $mab_term->slug ] = $mab_term->name;
	}

	ob_start();
	?>
	<article class="mab-post" data-cats="<?php echo esc_attr( implode( ' ', $mab_slugs ) ); ?>">
		<?php if ( $mab_image && has_post_thumbnail() ) : ?>
			<a class="mab-post__image" href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
				<?php the_post_thumbnail( 'medium_large', array( 'loading' => 'lazy' ) ); ?>
			</a>
		<?php endif; ?>
		<div class="mab-post__body">
			<?php if ( $mab_date ) : ?>
				<time class="mab-post__date" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
			<?php endif; ?>
			<h3 class="mab-post__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
			<?php if ( $mab_excerpt ) : ?>
				<p class="mab-post__excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), $mab_words ) ); ?></p>
			<?php endif; ?>
		</div>
	</article>
	<?php
	$mab_cards[] = ob_get_clean();
}
wp_reset_postdata();

asort( $mab_terms );
?>
<div <?php echo $mab_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built by core. ?>>
	<?php if ( $mab_filters && count( $mab_terms ) > 1 ) : ?>
		<div class="mab-posts__filters" role="group" aria-label="<?php esc_attr_e( 'Filter posts by category', 'my-animated-block' ); ?>">
			<button type="button" class="mab-posts__filter is-active" data-filter="" aria-pressed="true"><?php esc_html_e( 'All', 'my-animated-block' ); ?></button>
			<?php foreach ( $mab_terms as $mab_slug => $mab_name ) : ?>
				<button type="button" class="mab-posts__filter" data-filter="<?php echo esc_attr( $mab_slug ); ?>" aria-pressed="false"><?php echo esc_html( $mab_name ); ?></button>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
	<div class="mab-posts__grid">
		<?php echo implode( '', $mab_cards ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Each card is escaped above. ?>
	</div>
</div>
