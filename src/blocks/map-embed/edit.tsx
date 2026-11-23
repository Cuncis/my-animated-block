import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { CSSProperties } from 'react';
import type { MapAttributes } from './types';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< MapAttributes > ) {
	const { query, height, title, buttonText } = attributes;
	const blockProps = useBlockProps( {
		className: 'mab-map',
		style: { '--mab-map-h': `${ height }px` } as CSSProperties,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Map', 'my-animated-block' ) }>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Address or place', 'my-animated-block' ) }
						help={ __(
							'e.g. "Monas, Jakarta" or a full street address.',
							'my-animated-block'
						) }
						value={ query }
						onChange={ ( value: string ) => setAttributes( { query: value } ) }
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Accessible title', 'my-animated-block' ) }
						value={ title }
						onChange={ ( value: string ) => setAttributes( { title: value } ) }
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Button text', 'my-animated-block' ) }
						value={ buttonText }
						onChange={ ( value: string ) => setAttributes( { buttonText: value } ) }
					/>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Height (px)', 'my-animated-block' ) }
						value={ height }
						min={ 200 }
						max={ 800 }
						step={ 10 }
						onChange={ ( value?: number ) => setAttributes( { height: value ?? 400 } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="mab-map__placeholder">
					<p className="mab-map__address">
						{ query || __( 'Enter an address in the sidebar', 'my-animated-block' ) }
					</p>
					<div className="mab-map__actions">
						<span className="mab-map__load">{ buttonText }</span>
					</div>
					<p className="mab-map__note">
						{ __( 'Loading the map connects to Google.', 'my-animated-block' ) }
					</p>
				</div>
			</div>
		</>
	);
}
