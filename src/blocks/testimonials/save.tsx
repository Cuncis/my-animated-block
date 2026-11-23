import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import type { TestimonialsAttributes } from './types';

export default function save( {
	attributes,
}: BlockSaveProps< TestimonialsAttributes > ) {
	const { layout, columns } = attributes;
	const blockProps = useBlockProps.save( {
		className: `mab-testimonials mab-testimonials--${ layout } mab-testimonials--cols-${ columns }`,
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
