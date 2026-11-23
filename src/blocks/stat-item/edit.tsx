import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import Value from './Value';
import type { StatItemAttributes } from './types';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< StatItemAttributes > ) {
	const { value, decimals, prefix, suffix, label } = attributes;
	const blockProps = useBlockProps( { className: 'mab-stat' } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Number', 'my-animated-block' ) }>
					<NumberControl
						__next40pxDefaultSize
						label={ __( 'Value', 'my-animated-block' ) }
						value={ value }
						onChange={ ( next?: string ) => {
							const parsed = Number.parseFloat( next ?? '' );
							setAttributes( { value: Number.isFinite( parsed ) ? parsed : 0 } );
						} }
					/>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Decimal places', 'my-animated-block' ) }
						value={ decimals }
						min={ 0 }
						max={ 4 }
						onChange={ ( next?: number ) =>
							setAttributes( { decimals: next ?? 0 } )
						}
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Prefix (e.g. $)', 'my-animated-block' ) }
						value={ prefix }
						onChange={ ( next: string ) => setAttributes( { prefix: next } ) }
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Suffix (e.g. +, %, k)', 'my-animated-block' ) }
						value={ suffix }
						onChange={ ( next: string ) => setAttributes( { suffix: next } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<Value value={ value } decimals={ decimals } prefix={ prefix } suffix={ suffix } />
				<RichText
					tagName="p"
					className="mab-stat__label"
					value={ label }
					onChange={ ( next: string ) => setAttributes( { label: next } ) }
					placeholder={ __( 'Label', 'my-animated-block' ) }
					allowedFormats={ [] }
				/>
			</div>
		</>
	);
}
