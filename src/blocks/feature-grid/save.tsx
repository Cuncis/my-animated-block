import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { FeatureGridAttributes } from './types';

export default function save( {
	attributes,
}: BlockSaveProps< FeatureGridAttributes > ) {
	const blockProps = useBlockProps.save( {
		className: `mab-feature-grid mab-feature-grid--cols-${ attributes.columns }`,
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
