<?php
/**
 * Contact form submission handler.
 *
 * The form posts to admin-post.php. Protections, none of which need an
 * external service or JavaScript:
 *  - honeypot field (bots fill it, people never see it);
 *  - signed render timestamp (rejects instant posts and forged/expired forms);
 *  - per-IP rate limit;
 *  - the recipient is NEVER taken from the request: it is looked up from the
 *    saved block settings, falling back to the site admin email.
 *
 * @package MyAnimatedBlock
 */

declare( strict_types=1 );

namespace MyAnimatedBlock;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const FORM_MIN_SECONDS = 3;
const FORM_MAX_SECONDS = 2 * DAY_IN_SECONDS;
const FORM_RATE_LIMIT  = 5;

add_action( 'admin_post_nopriv_mab_contact_form', __NAMESPACE__ . '\\handle_contact_form' );
add_action( 'admin_post_mab_contact_form', __NAMESPACE__ . '\\handle_contact_form' );

/**
 * Redirects back to the page with a result code, then stops.
 *
 * @param int    $post_id Page the form is on.
 * @param string $form_id Form instance id.
 * @param string $status  success|invalid|rate|failed|expired.
 */
function finish_contact_form( int $post_id, string $form_id, string $status ): void {
	$base = $post_id > 0 ? get_permalink( $post_id ) : home_url( '/' );
	if ( ! is_string( $base ) || '' === $base ) {
		$base = home_url( '/' );
	}

	$url = add_query_arg(
		array(
			'mab_form' => $status,
			'mab_fid'  => $form_id,
		),
		$base
	) . '#mab-form-' . $form_id;

	wp_safe_redirect( $url, 303 );
	exit;
}

/**
 * Finds the settings of a contact form block saved in a post.
 *
 * @param array  $blocks  Parsed blocks.
 * @param string $form_id Form instance id.
 * @return array|null Block attributes, or null when not found.
 */
function find_form_attributes( array $blocks, string $form_id ): ?array {
	foreach ( $blocks as $block ) {
		if (
			'my-animated-block/contact-form' === ( $block['blockName'] ?? '' )
			&& isset( $block['attrs']['formId'] )
			&& $form_id === $block['attrs']['formId']
		) {
			return (array) $block['attrs'];
		}

		if ( ! empty( $block['innerBlocks'] ) ) {
			$found = find_form_attributes( $block['innerBlocks'], $form_id );
			if ( null !== $found ) {
				return $found;
			}
		}
	}

	return null;
}

/**
 * Handles a contact form submission.
 */
function handle_contact_form(): void {
	// phpcs:disable WordPress.Security.NonceVerification.Missing -- Cache-friendly signed timestamp is used instead of a nonce.
	$post_id = isset( $_POST['mab_post'] ) ? absint( wp_unslash( $_POST['mab_post'] ) ) : 0;
	$form_id = isset( $_POST['mab_fid'] ) ? preg_replace( '/[^a-f0-9]/', '', (string) wp_unslash( $_POST['mab_fid'] ) ) : '';
	$time    = isset( $_POST['mab_ts'] ) ? absint( wp_unslash( $_POST['mab_ts'] ) ) : 0;
	$sig     = isset( $_POST['mab_sig'] ) ? (string) wp_unslash( $_POST['mab_sig'] ) : '';

	if ( '' === $form_id ) {
		wp_safe_redirect( home_url( '/' ), 303 );
		exit;
	}

	// Honeypot: pretend success so bots learn nothing.
	if ( ! empty( $_POST['mab_website'] ) ) {
		finish_contact_form( $post_id, $form_id, 'success' );
	}

	$expected = hash_hmac( 'sha256', $form_id . '|' . $time, wp_salt( 'auth' ) );
	$elapsed  = time() - $time;

	if ( ! hash_equals( $expected, $sig ) || $elapsed > FORM_MAX_SECONDS ) {
		finish_contact_form( $post_id, $form_id, 'expired' );
	}

	if ( $elapsed < FORM_MIN_SECONDS ) {
		finish_contact_form( $post_id, $form_id, 'invalid' );
	}

	// Rate limit by IP (REMOTE_ADDR only: forwarded headers are spoofable).
	$ip     = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	$bucket = 'mab_rl_' . md5( $ip );
	$count  = (int) get_transient( $bucket );

	if ( $count >= FORM_RATE_LIMIT ) {
		finish_contact_form( $post_id, $form_id, 'rate' );
	}

	$name    = isset( $_POST['mab_name'] ) ? sanitize_text_field( wp_unslash( $_POST['mab_name'] ) ) : '';
	$email   = isset( $_POST['mab_email'] ) ? sanitize_email( wp_unslash( $_POST['mab_email'] ) ) : '';
	$phone   = isset( $_POST['mab_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['mab_phone'] ) ) : '';
	$message = isset( $_POST['mab_message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['mab_message'] ) ) : '';
	// phpcs:enable WordPress.Security.NonceVerification.Missing

	$name    = mb_substr( $name, 0, 100 );
	$message = mb_substr( $message, 0, 5000 );
	$phone   = mb_substr( $phone, 0, 40 );

	if ( '' === $name || '' === $message || ! is_email( $email ) ) {
		finish_contact_form( $post_id, $form_id, 'invalid' );
	}

	// Settings come from the saved block, never from the request.
	$settings = null;
	$post     = $post_id > 0 ? get_post( $post_id ) : null;
	if ( $post instanceof \WP_Post && 'publish' === $post->post_status && '' === $post->post_password ) {
		$settings = find_form_attributes( parse_blocks( $post->post_content ), $form_id );
	}

	$recipient = is_array( $settings ) && ! empty( $settings['recipient'] ) ? sanitize_email( (string) $settings['recipient'] ) : '';
	if ( ! is_email( $recipient ) ) {
		$recipient = (string) get_option( 'admin_email' );
	}

	$subject = is_array( $settings ) && ! empty( $settings['subject'] ) ? (string) $settings['subject'] : __( 'New message from your website', 'my-animated-block' );
	$subject = sprintf( '[%s] %s', wp_specialchars_decode( get_bloginfo( 'name' ), ENT_QUOTES ), sanitize_text_field( $subject ) );

	$lines   = array(
		/* translators: %s: sender name */
		sprintf( __( 'Name: %s', 'my-animated-block' ), $name ),
		/* translators: %s: sender email */
		sprintf( __( 'Email: %s', 'my-animated-block' ), $email ),
	);
	if ( '' !== $phone ) {
		/* translators: %s: sender phone */
		$lines[] = sprintf( __( 'Phone: %s', 'my-animated-block' ), $phone );
	}
	$lines[] = '';
	$lines[] = $message;
	$lines[] = '';
	$lines[] = '--';
	/* translators: %s: page URL */
	$lines[] = sprintf( __( 'Sent from: %s', 'my-animated-block' ), $post_id > 0 ? (string) get_permalink( $post_id ) : home_url( '/' ) );

	// Reply-To uses the validated email; strip anything that could break the header.
	$reply_name = trim( str_replace( array( '"', '<', '>', ',', "\r", "\n" ), '', $name ) );
	$headers    = array( sprintf( 'Reply-To: %s <%s>', $reply_name, $email ) );

	set_transient( $bucket, $count + 1, HOUR_IN_SECONDS );

	$sent = wp_mail( $recipient, $subject, implode( "\n", $lines ), $headers );

	finish_contact_form( $post_id, $form_id, $sent ? 'success' : 'failed' );
}
