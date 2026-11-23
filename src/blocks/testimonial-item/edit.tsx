import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import MediaPicker from '../../shared/MediaPicker';
import { renderStars } from './stars';
import type { TestimonialAttributes } from './types';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< TestimonialAttributes > ) {
	const { quote, name, role, avatarUrl, rating } = attributes;
	const blockProps = useBlockProps( { className: 'mab-testimonial' } );
	const stars = renderStars( rating );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Testimonial', 'my-animated-block' ) }>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Star rating (0 hides stars)', 'my-animated-block' ) }
						value={ rating }
						min={ 0 }
						max={ 5 }
						onChange={ ( value?: number ) =>
							setAttributes( { rating: value ?? 5 } )
						}
					/>
					<MediaPicker
						url={ avatarUrl }
						allowedTypes={ [ 'image' ] }
						label={ __( 'Select photo', 'my-animated-block' ) }
						onSelect={ ( media ) =>
							setAttributes( { avatarId: media.id, avatarUrl: media.url } )
						}
						onRemove={ () =>
							setAttributes( { avatarId: undefined, avatarUrl: '' } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<figure { ...blockProps }>
				{ stars ? (
					<div className="mab-testimonial__stars" aria-hidden="true">
						{ stars }
					</div>
				) : null }
				<blockquote className="mab-testimonial__quote-wrap" style={ { margin: 0 } }>
					<RichText
						tagName="p"
						className="mab-testimonial__quote"
						value={ quote }
						onChange={ ( value: string ) => setAttributes( { quote: value } ) }
						placeholder={ __( 'What did the customer say?', 'my-animated-block' ) }
					/>
				</blockquote>
				<div className="mab-testimonial__author">
					{ avatarUrl ? (
						<img className="mab-testimonial__avatar" src={ avatarUrl } alt="" />
					) : null }
					<span>
						<RichText
							tagName="span"
							className="mab-testimonial__name"
							value={ name }
							onChange={ ( value: string ) => setAttributes( { name: value } ) }
							placeholder={ __( 'Name', 'my-animated-block' ) }
							allowedFormats={ [] }
						/>
						<RichText
							tagName="span"
							className="mab-testimonial__role"
							value={ role }
							onChange={ ( value: string ) => setAttributes( { role: value } ) }
							placeholder={ __( 'Role, Company', 'my-animated-block' ) }
							allowedFormats={ [] }
						/>
					</span>
				</div>
			</figure>
		</>
	);
}
