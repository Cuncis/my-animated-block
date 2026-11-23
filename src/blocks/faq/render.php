<?php
/**
 * Server render for the FAQ block.
 *
 * Wraps the already-rendered FAQ items and, when enabled, appends a
 * FAQPage JSON-LD document built from the item attributes.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Rendered inner blocks.
 * @var WP_Block $block      Block instance.
 *
 * @package MyAnimatedBlock
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$mab_wrapper = get_block_wrapper_attributes( array( 'class' => 'mab-faq' ) );

$mab_schema = '';

if ( ! empty( $attributes['schema'] ) ) {
	$mab_allowed = array(
		'a'      => array( 'href' => true ),
		'br'     => array(),
		'strong' => array(),
		'b'      => array(),
		'em'     => array(),
		'i'      => array(),
		'p'      => array(),
		'ul'     => array(),
		'ol'     => array(),
		'li'     => array(),
	);
	$mab_entities = array();

	foreach ( $block->inner_blocks as $mab_item ) {
		if ( 'my-animated-block/faq-item' !== $mab_item->name ) {
			continue;
		}

		$mab_question = trim( wp_strip_all_tags( (string) ( $mab_item->attributes['question'] ?? '' ) ) );
		$mab_answer   = trim( wp_kses( (string) ( $mab_item->attributes['answer'] ?? '' ), $mab_allowed ) );

		if ( '' === $mab_question || '' === $mab_answer ) {
			continue;
		}

		$mab_entities[] = array(
			'@type'          => 'Question',
			'name'           => $mab_question,
			'acceptedAnswer' => array(
				'@type' => 'Answer',
				'text'  => $mab_answer,
			),
		);
	}

	if ( array() !== $mab_entities ) {
		$mab_json = wp_json_encode(
			array(
				'@context'   => 'https://schema.org',
				'@type'      => 'FAQPage',
				'mainEntity' => $mab_entities,
			),
			JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP
		);

		if ( is_string( $mab_json ) ) {
			// JSON_HEX_TAG/AMP make this safe inside a <script> element.
			$mab_schema = '<script type="application/ld+json">' . $mab_json . '</script>';
		}
	}
}

printf(
	'<div %1$s>%2$s%3$s</div>',
	$mab_wrapper, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Built by core.
	$content, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Rendered blocks.
	$mab_schema // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Encoded above.
);
