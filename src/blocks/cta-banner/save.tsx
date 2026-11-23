import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { CtaAttributes } from './types';

export default function save( { attributes }: BlockSaveProps< CtaAttributes > ) {
	const blockProps = useBlockProps.save( {
		className: `mab-cta mab-cta--${ attributes.layout }`,
	} );

	return (
		<div { ...blockProps }>
			<div className="mab-cta__inner">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
