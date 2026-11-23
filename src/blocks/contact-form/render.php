<?php
/**
 * Server render for the Contact Form block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Unused (no inner blocks).
 * @var WP_Block $block      Block instance.
 *
 * @package MyAnimatedBlock
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mab_form_id = isset( $attributes['formId'] ) ? preg_replace( '/[^a-f0-9]/', '', (string) $attributes['formId'] ) : '';

if ( '' === $mab_form_id ) {
	// Not saved from the editor yet; nothing to submit to.
	return;
}

$mab_post_id = (int) get_the_ID();
$mab_time    = time();
$mab_sig     = hash_hmac( 'sha256', $mab_form_id . '|' . $mab_time, wp_salt( 'auth' ) );

// Result of the last submission for THIS form (set by the handler's redirect).
// phpcs:disable WordPress.Security.NonceVerification.Recommended -- Read-only display state.
$mab_status = '';
if ( isset( $_GET['mab_fid'], $_GET['mab_form'] ) && $mab_form_id === sanitize_key( wp_unslash( $_GET['mab_fid'] ) ) ) {
	$mab_status = sanitize_key( wp_unslash( $_GET['mab_form'] ) );
}
// phpcs:enable WordPress.Security.NonceVerification.Recommended

$mab_dom = 'mab-form-' . $mab_form_id;

$mab_errors = array(
	'invalid' => __( 'Please fill in your name, a valid email address and a message.', 'my-animated-block' ),
	'rate'    => __( 'Too many messages. Please try again later.', 'my-animated-block' ),
	'failed'  => __( 'Your message could not be sent. Please try again later.', 'my-animated-block' ),
	'expired' => __( 'The form expired. Please reload the page and try again.', 'my-animated-block' ),
);

$mab_show_phone = ! empty( $attributes['showPhone'] );
$mab_button     = isset( $attributes['buttonText'] ) && '' !== $attributes['buttonText']
	? (string) $attributes['buttonText']
	: __( 'Send message', 'my-animated-block' );
$mab_success    = isset( $attributes['successMessage'] ) && '' !== $attributes['successMessage']
	? (string) $attributes['successMessage']
	: __( 'Thanks! Your message has been sent.', 'my-animated-block' );

$mab_wrapper = get_block_wrapper_attributes(
	array(
		'class' => 'mab-form',
		'id'    => $mab_dom,
	)
);
?>
<div <?php echo $mab_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built by core. ?>>
	<?php if ( 'success' === $mab_status ) : ?>
		<p class="mab-form__notice mab-form__notice--success" role="status"><?php echo esc_html( $mab_success ); ?></p>
	<?php else : ?>
		<?php if ( isset( $mab_errors[ $mab_status ] ) ) : ?>
			<p class="mab-form__notice mab-form__notice--error" role="alert"><?php echo esc_html( $mab_errors[ $mab_status ] ); ?></p>
		<?php endif; ?>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="mab-form__form">
			<input type="hidden" name="action" value="mab_contact_form" />
			<input type="hidden" name="mab_post" value="<?php echo esc_attr( (string) $mab_post_id ); ?>" />
			<input type="hidden" name="mab_fid" value="<?php echo esc_attr( $mab_form_id ); ?>" />
			<input type="hidden" name="mab_ts" value="<?php echo esc_attr( (string) $mab_time ); ?>" />
			<input type="hidden" name="mab_sig" value="<?php echo esc_attr( $mab_sig ); ?>" />

			<div class="mab-form__hp" aria-hidden="true">
				<label><?php esc_html_e( 'Leave this field empty', 'my-animated-block' ); ?>
					<input type="text" name="mab_website" tabindex="-1" autocomplete="off" />
				</label>
			</div>

			<div class="mab-form__field">
				<label for="<?php echo esc_attr( $mab_dom ); ?>-name"><?php esc_html_e( 'Name', 'my-animated-block' ); ?></label>
				<input type="text" id="<?php echo esc_attr( $mab_dom ); ?>-name" name="mab_name" required maxlength="100" autocomplete="name" />
			</div>

			<div class="mab-form__field">
				<label for="<?php echo esc_attr( $mab_dom ); ?>-email"><?php esc_html_e( 'Email', 'my-animated-block' ); ?></label>
				<input type="email" id="<?php echo esc_attr( $mab_dom ); ?>-email" name="mab_email" required maxlength="150" autocomplete="email" />
			</div>

			<?php if ( $mab_show_phone ) : ?>
				<div class="mab-form__field">
					<label for="<?php echo esc_attr( $mab_dom ); ?>-phone"><?php esc_html_e( 'Phone', 'my-animated-block' ); ?></label>
					<input type="tel" id="<?php echo esc_attr( $mab_dom ); ?>-phone" name="mab_phone" maxlength="40" autocomplete="tel" />
				</div>
			<?php endif; ?>

			<div class="mab-form__field">
				<label for="<?php echo esc_attr( $mab_dom ); ?>-message"><?php esc_html_e( 'Message', 'my-animated-block' ); ?></label>
				<textarea id="<?php echo esc_attr( $mab_dom ); ?>-message" name="mab_message" rows="5" required maxlength="5000"></textarea>
			</div>

			<button type="submit" class="mab-form__submit wp-block-button__link wp-element-button"><?php echo esc_html( $mab_button ); ?></button>
		</form>
	<?php endif; ?>
</div>
