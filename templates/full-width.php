<?php
/**
 * Template: Full Width (Site Blocks).
 *
 * Keeps the site header and footer, but drops the theme's narrow content
 * column and the page title, so blocks can use the whole width.
 *
 * @package MyAnimatedBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

while ( have_posts() ) :
	the_post();
	?>
	<main id="content" <?php post_class( 'site-main mab-layout' ); ?>>
		<?php
		the_content();
		wp_link_pages();
		?>
	</main>
	<?php
endwhile;

get_footer();
