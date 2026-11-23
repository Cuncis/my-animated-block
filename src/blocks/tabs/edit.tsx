import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const ITEM = 'my-animated-block/tab-item';

const TEMPLATE: [ string, Record< string, unknown > ][] = [
	[ ITEM, { title: 'Tab one' } ],
	[ ITEM, { title: 'Tab two' } ],
	[ ITEM, { title: 'Tab three' } ],
];

export default function Edit() {
	const blockProps = useBlockProps( { className: 'mab-tabs' } );
	const innerProps = useInnerBlocksProps(
		{ className: 'mab-tabs__panels' },
		{ allowedBlocks: [ ITEM ], template: TEMPLATE }
	);

	return (
		<div { ...blockProps }>
			<div { ...innerProps } />
		</div>
	);
}
