import { RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import Value from './Value';
import type { StatItemAttributes } from './types';

export default function save( { attributes }: BlockSaveProps< StatItemAttributes > ) {
	const { value, decimals, prefix, suffix, label } = attributes;
	const blockProps = useBlockProps.save( { className: 'mab-stat' } );

	return (
		<div { ...blockProps }>
			<Value value={ value } decimals={ decimals } prefix={ prefix } suffix={ suffix } />
			<RichText.Content tagName="p" className="mab-stat__label" value={ label } />
		</div>
	);
}
