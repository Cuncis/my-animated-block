import {
	InnerBlocks,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { TabItemAttributes } from './types';

export default function save( { attributes }: BlockSaveProps< TabItemAttributes > ) {
	const blockProps = useBlockProps.save( { className: 'mab-tab' } );

	return (
		<div { ...blockProps }>
			<RichText.Content
				tagName="h3"
				className="mab-tab__title"
				value={ attributes.title }
			/>
			<div className="mab-tab__body">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
