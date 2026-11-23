import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/** The tab bar is built by view.ts from each panel's title. */
export default function save() {
	const blockProps = useBlockProps.save( { className: 'mab-tabs' } );
	return (
		<div { ...blockProps }>
			<div className="mab-tabs__panels">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
