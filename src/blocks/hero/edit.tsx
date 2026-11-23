import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import MediaPicker from '../../shared/MediaPicker';
import { HERO_ALLOWED_BLOCKS, HERO_TEMPLATE } from './template';
import type { HeroAttributes } from './types';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< HeroAttributes > ) {
	const { mediaType, mediaUrl, mediaAlt, overlay, minHeight, textAlign } =
		attributes;

	const blockProps = useBlockProps( {
		className: `mab-hero mab-hero--${ textAlign }`,
		style: { minHeight: `${ minHeight }px` },
	} );
	const innerProps = useInnerBlocksProps(
		{ className: 'mab-hero__content' },
		{ allowedBlocks: HERO_ALLOWED_BLOCKS, template: HERO_TEMPLATE }
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Background', 'my-animated-block' ) }>
					<MediaPicker
						url={ mediaUrl }
						allowedTypes={ [ 'image', 'video' ] }
						label={ __( 'Select image or video', 'my-animated-block' ) }
						onSelect={ ( media ) =>
							setAttributes( {
								mediaId: media.id,
								mediaUrl: media.url,
								mediaAlt: media.alt,
								mediaType:
									media.type === 'video' ? 'video' : 'image',
							} )
						}
						onRemove={ () =>
							setAttributes( {
								mediaId: undefined,
								mediaUrl: '',
								mediaAlt: '',
							} )
						}
					/>
					{ mediaUrl && mediaType === 'image' ? (
						<TextControl
							__next40pxDefaultSize
							label={ __( 'Alt text', 'my-animated-block' ) }
							help={ __(
								'Leave empty if the image is purely decorative.',
								'my-animated-block'
							) }
							value={ mediaAlt }
							onChange={ ( value: string ) =>
								setAttributes( { mediaAlt: value } )
							}
						/>
					) : null }
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Overlay darkness (%)', 'my-animated-block' ) }
						value={ overlay }
						min={ 0 }
						max={ 90 }
						onChange={ ( value?: number ) =>
							setAttributes( { overlay: value ?? 45 } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Layout', 'my-animated-block' ) }>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Minimum height (px)', 'my-animated-block' ) }
						value={ minHeight }
						min={ 240 }
						max={ 1000 }
						step={ 10 }
						onChange={ ( value?: number ) =>
							setAttributes( { minHeight: value ?? 560 } )
						}
					/>
					<SelectControl
						__next40pxDefaultSize
						label={ __( 'Content alignment', 'my-animated-block' ) }
						value={ textAlign }
						options={ [
							{ value: 'center', label: __( 'Centered', 'my-animated-block' ) },
							{ value: 'left', label: __( 'Left', 'my-animated-block' ) },
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								textAlign: value === 'left' ? 'left' : 'center',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ mediaUrl && mediaType === 'video' ? (
					<video
						className="mab-hero__media"
						src={ mediaUrl }
						muted
						loop
						playsInline
					/>
				) : null }
				{ mediaUrl && mediaType === 'image' ? (
					<img className="mab-hero__media" src={ mediaUrl } alt="" />
				) : null }
				<span
					className="mab-hero__overlay"
					style={ { opacity: overlay / 100 } }
					aria-hidden="true"
				/>
				<div { ...innerProps } />
			</div>
		</>
	);
}
