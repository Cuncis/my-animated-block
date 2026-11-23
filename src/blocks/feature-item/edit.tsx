import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import MediaPicker from '../../shared/MediaPicker';
import type { FeatureItemAttributes } from './types';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< FeatureItemAttributes > ) {
	const { icon, iconUrl, title, text } = attributes;
	const blockProps = useBlockProps( { className: 'mab-feature' } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Icon', 'my-animated-block' ) }>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Emoji or symbol', 'my-animated-block' ) }
						value={ icon }
						maxLength={ 4 }
						onChange={ ( value: string ) =>
							setAttributes( { icon: value } )
						}
					/>
					<MediaPicker
						url={ iconUrl }
						allowedTypes={ [ 'image' ] }
						label={ __( 'Use an image instead', 'my-animated-block' ) }
						onSelect={ ( media ) =>
							setAttributes( { iconId: media.id, iconUrl: media.url } )
						}
						onRemove={ () =>
							setAttributes( { iconId: undefined, iconUrl: '' } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ iconUrl || icon ? (
					<div className="mab-feature__icon" aria-hidden="true">
						{ iconUrl ? <img src={ iconUrl } alt="" /> : icon }
					</div>
				) : null }
				<RichText
					tagName="h3"
					className="mab-feature__title"
					value={ title }
					onChange={ ( value: string ) => setAttributes( { title: value } ) }
					placeholder={ __( 'Feature title', 'my-animated-block' ) }
					allowedFormats={ [] }
				/>
				<RichText
					tagName="p"
					className="mab-feature__text"
					value={ text }
					onChange={ ( value: string ) => setAttributes( { text: value } ) }
					placeholder={ __( 'Describe this feature…', 'my-animated-block' ) }
				/>
			</div>
		</>
	);
}
