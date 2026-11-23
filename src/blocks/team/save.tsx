import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { TeamAttributes } from './types';

export default function save( { attributes }: BlockSaveProps< TeamAttributes > ) {
	const blockProps = useBlockProps.save( {
		className: `mab-team mab-team--cols-${ attributes.columns }`,
	} );
	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
