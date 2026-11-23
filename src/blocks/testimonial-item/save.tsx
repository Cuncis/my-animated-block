import { RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import { renderStars } from './stars';
import type { TestimonialAttributes } from './types';

export default function save( {
	attributes,
}: BlockSaveProps< TestimonialAttributes > ) {
	const { quote, name, role, avatarUrl, rating } = attributes;
	const blockProps = useBlockProps.save( { className: 'mab-testimonial' } );
	const stars = renderStars( rating );

	return (
		<figure { ...blockProps }>
			{ stars ? (
				<div
					className="mab-testimonial__stars"
					role="img"
					aria-label={ `${ rating } / 5` }
				>
					{ stars }
				</div>
			) : null }
			<blockquote className="mab-testimonial__quote-wrap" style={ { margin: 0 } }>
				<RichText.Content
					tagName="p"
					className="mab-testimonial__quote"
					value={ quote }
				/>
			</blockquote>
			<figcaption className="mab-testimonial__author">
				{ avatarUrl ? (
					<img
						className="mab-testimonial__avatar"
						src={ avatarUrl }
						alt=""
						loading="lazy"
						decoding="async"
					/>
				) : null }
				<span>
					<RichText.Content
						tagName="span"
						className="mab-testimonial__name"
						value={ name }
					/>
					<RichText.Content
						tagName="span"
						className="mab-testimonial__role"
						value={ role }
					/>
				</span>
			</figcaption>
		</figure>
	);
}
