import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { CSSProperties } from 'react';
import type { Logo, LogoCarouselAttributes } from './types';

function toLogos( media: Record< string, unknown >[] ): Logo[] {
	return media.map( ( item ) => ( {
		id: Number( item.id ),
		url: String( item.url ?? '' ),
		alt: String( item.alt ?? '' ),
	} ) );
}

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< LogoCarouselAttributes > ) {
	const { images, speed, logoHeight, grayscale } = attributes;

	const blockProps = useBlockProps( {
		className: `mab-logos mab-logos--editor${ grayscale ? ' is-grayscale' : '' }`,
		style: { '--mab-logo-h': `${ logoHeight }px` } as CSSProperties,
	} );

	const picker = (
		<MediaUploadCheck>
			<MediaUpload
				allowedTypes={ [ 'image' ] }
				multiple
				gallery
				value={ images.map( ( image ) => image.id ) }
				onSelect={ ( media: Record< string, unknown >[] ) =>
					setAttributes( { images: toLogos( media ) } )
				}
				render={ ( { open }: { open: () => void } ) => (
					<Button __next40pxDefaultSize variant="secondary" onClick={ open }>
						{ images.length
							? __( 'Edit logos', 'my-animated-block' )
							: __( 'Select logos', 'my-animated-block' ) }
					</Button>
				) }
			/>
		</MediaUploadCheck>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Logos', 'my-animated-block' ) }>
					{ picker }
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Logo height (px)', 'my-animated-block' ) }
						value={ logoHeight }
						min={ 20 }
						max={ 120 }
						onChange={ ( value?: number ) =>
							setAttributes( { logoHeight: value ?? 48 } )
						}
					/>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Seconds per loop (higher = slower)', 'my-animated-block' ) }
						value={ speed }
						min={ 8 }
						max={ 90 }
						onChange={ ( value?: number ) =>
							setAttributes( { speed: value ?? 30 } )
						}
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Grayscale until hovered', 'my-animated-block' ) }
						checked={ grayscale }
						onChange={ ( value: boolean ) =>
							setAttributes( { grayscale: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ images.length === 0 ? (
					<div className="mab-logos__empty">
						<p>{ __( 'Add the logos you want to show.', 'my-animated-block' ) }</p>
						{ picker }
					</div>
				) : (
					<ul className="mab-logos__list">
						{ images.map( ( image, index ) => (
							<li key={ `${ image.id }-${ index }` } className="mab-logos__item">
								<img src={ image.url } alt={ image.alt } />
							</li>
						) ) }
					</ul>
				) }
			</div>
		</>
	);
}
