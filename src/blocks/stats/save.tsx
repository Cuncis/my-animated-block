import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { StatsAttributes } from './types';

export default function save( { attributes }: BlockSaveProps< StatsAttributes > ) {
	const blockProps = useBlockProps.save( {
		className: `mab-stats mab-stats--cols-${ attributes.columns }`,
	} );
	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
