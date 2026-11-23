import { RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { CSSProperties } from 'react';
import type { MediaLightboxAttributes } from './types';

export default function save( {
	attributes,
}: BlockSaveProps< MediaLightboxAttributes > ) {
	const { kind, imageUrl, fullUrl, alt, videoUrl, ratio, caption } = attributes;
	const target = kind === 'video' ? videoUrl : fullUrl || imageUrl;

	if ( ! target ) {
		return null;
	}

	const blockProps = useBlockProps.save( {
		className: `mab-media mab-media--${ kind }`,
		style: ( ratio === 'auto'
			? {}
			: { '--mab-media-ratio': ratio.replace( '/', ' / ' ) } ) as CSSProperties,
	} );

	return (
		<figure { ...blockProps }>
			<button
				type="button"
				className="mab-media__trigger"
				data-kind={ kind }
				data-src={ target }
				data-alt={ alt }
				aria-haspopup="dialog"
				aria-label={ alt || ( kind === 'video' ? 'Play video' : 'Enlarge image' ) }
			>
				{ imageUrl ? (
					<img src={ imageUrl } alt="" loading="lazy" decoding="async" />
				) : (
					<span className="mab-media__blank" />
				) }
				{ kind === 'video' ? (
					<span className="mab-media__play" aria-hidden="true" />
				) : null }
			</button>
			<RichText.Content
				tagName="figcaption"
				className="mab-media__caption"
				value={ caption }
			/>
		</figure>
	);
}
