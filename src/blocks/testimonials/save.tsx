import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import type { TestimonialsAttributes } from './types';

export default function save( {
	attributes,
}: BlockSaveProps< TestimonialsAttributes > ) {
	const { layout, columns, showArrows, showDots, autoplay, autoplaySeconds } =
		attributes;
	const blockProps = useBlockProps.save( {
		className: `mab-testimonials mab-testimonials--${ layout } mab-testimonials--cols-${ columns }`,
		// Only emitted when changed from the default, so blocks saved before
		// these options existed keep validating.
		...( layout === 'slider' && ! showArrows ? { 'data-arrows': '0' } : {} ),
		...( layout === 'slider' && ! showDots ? { 'data-dots': '0' } : {} ),
		...( layout === 'slider' && autoplay
			? { 'data-autoplay': String( Math.max( 2, autoplaySeconds ) * 1000 ) }
			: {} ),
	} );

	const trackProps =
		layout === 'slider'
			? {
					tabIndex: 0,
					role: 'region',
					'aria-label': __( 'Testimonials', 'my-animated-block' ),
			  }
			: {};

	return (
		<div { ...blockProps }>
			<div className="mab-testimonials__track" { ...trackProps }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
