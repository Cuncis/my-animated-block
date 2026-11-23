<?php
/**
 * Template: Canvas (Site Blocks).
 *
 * A blank page: no theme header, footer, title or content column. The page's
 * own blocks (for example a Site Header block) are the whole page.
 *
 * @package MyAnimatedBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php
wp_body_open();

while ( have_posts() ) :
	the_post();
	?>
	<main id="content" class="mab-layout">
		<?php the_content(); ?>
	</main>
	<?php
endwhile;

wp_footer();
?>
</body>
</html>
