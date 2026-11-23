import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { CSSProperties } from 'react';
import MediaPicker from '../../shared/MediaPicker';
import type { MediaLightboxAttributes } from './types';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< MediaLightboxAttributes > ) {
	const { kind, imageUrl, alt, videoUrl, ratio, caption } = attributes;

	const blockProps = useBlockProps( {
		className: `mab-media mab-media--${ kind }`,
		style: ( ratio === 'auto'
			? {}
			: { '--mab-media-ratio': ratio.replace( '/', ' / ' ) } ) as CSSProperties,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Media', 'my-animated-block' ) }>
					<SelectControl
						__next40pxDefaultSize
						label={ __( 'Opens', 'my-animated-block' ) }
						value={ kind }
						options={ [
							{ value: 'image', label: __( 'Full-size image', 'my-animated-block' ) },
							{ value: 'video', label: __( 'Video', 'my-animated-block' ) },
						] }
						onChange={ ( value: string ) =>
							setAttributes( { kind: value === 'video' ? 'video' : 'image' } )
						}
					/>
					<MediaPicker
						url={ imageUrl }
						allowedTypes={ [ 'image' ] }
						label={
							kind === 'video'
								? __( 'Select thumbnail', 'my-animated-block' )
								: __( 'Select image', 'my-animated-block' )
						}
						onSelect={ ( media ) =>
							setAttributes( {
								imageId: media.id,
								imageUrl: media.url,
								fullUrl: media.url,
								alt: media.alt,
							} )
						}
						onRemove={ () =>
							setAttributes( { imageId: undefined, imageUrl: '', fullUrl: '' } )
						}
					/>
					{ kind === 'video' ? (
						<TextControl
							__next40pxDefaultSize
							type="url"
							label={ __( 'Video URL', 'my-animated-block' ) }
							help={ __(
								'YouTube, Vimeo or a direct .mp4 / .webm link.',
								'my-animated-block'
							) }
							value={ videoUrl }
							onChange={ ( value: string ) => setAttributes( { videoUrl: value } ) }
						/>
					) : null }
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Alt text / accessible label', 'my-animated-block' ) }
						value={ alt }
						onChange={ ( value: string ) => setAttributes( { alt: value } ) }
					/>
					<SelectControl
						__next40pxDefaultSize
						label={ __( 'Thumbnail ratio', 'my-animated-block' ) }
						value={ ratio }
						options={ [
							{ value: '16/9', label: '16:9' },
							{ value: '4/3', label: '4:3' },
							{ value: '1/1', label: '1:1' },
							{ value: 'auto', label: __( 'Original', 'my-animated-block' ) },
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								ratio: value as MediaLightboxAttributes[ 'ratio' ],
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<figure { ...blockProps }>
				<div className="mab-media__trigger">
					{ imageUrl ? (
						<img src={ imageUrl } alt="" />
					) : (
						<span className="mab-media__blank">
							{ __( 'Choose an image in the sidebar', 'my-animated-block' ) }
						</span>
					) }
					{ kind === 'video' ? (
						<span className="mab-media__play" aria-hidden="true" />
					) : null }
				</div>
				<RichText
					tagName="figcaption"
					className="mab-media__caption"
					value={ caption }
					onChange={ ( value: string ) => setAttributes( { caption: value } ) }
					placeholder={ __( 'Caption (optional)', 'my-animated-block' ) }
				/>
			</figure>
		</>
	);
}
