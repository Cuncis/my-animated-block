import { __ } from '@wordpress/i18n';
import {
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import type { TabItemAttributes } from './types';

const TEMPLATE: [ string, Record< string, unknown > ][] = [
	[
		'core/paragraph',
		{ placeholder: __( 'Tab content…', 'my-animated-block' ) },
	],
];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< TabItemAttributes > ) {
	const blockProps = useBlockProps( { className: 'mab-tab' } );
	const innerProps = useInnerBlocksProps(
		{ className: 'mab-tab__body' },
		{ template: TEMPLATE }
	);

	return (
		<div { ...blockProps }>
			<RichText
				tagName="h3"
				className="mab-tab__title"
				value={ attributes.title }
				onChange={ ( value: string ) => setAttributes( { title: value } ) }
				placeholder={ __( 'Tab title', 'my-animated-block' ) }
				allowedFormats={ [] }
			/>
			<div { ...innerProps } />
		</div>
	);
}
