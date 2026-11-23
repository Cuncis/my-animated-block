import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { SectionAttributes } from './types';

export default function save( {
	attributes,
}: BlockSaveProps< SectionAttributes > ) {
	const { tag: Tag, width, spacing } = attributes;
	const blockProps = useBlockProps.save( {
		className: `mab-section mab-section--space-${ spacing }`,
	} );

	return (
		<Tag { ...blockProps }>
			<div className={ `mab-section__inner mab-section__inner--${ width }` }>
				<InnerBlocks.Content />
			</div>
		</Tag>
	);
}
