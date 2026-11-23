import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { CSSProperties } from 'react';
import type { LogoCarouselAttributes } from './types';

export default function save( {
	attributes,
}: BlockSaveProps< LogoCarouselAttributes > ) {
	const { images, speed, logoHeight, grayscale } = attributes;

	if ( images.length === 0 ) {
		return null;
	}

	const blockProps = useBlockProps.save( {
		className: `mab-logos${ grayscale ? ' is-grayscale' : '' }`,
		style: {
			'--mab-logos-speed': `${ speed }s`,
			'--mab-logo-h': `${ logoHeight }px`,
		} as CSSProperties,
	} );

	const items = images.map( ( image, index ) => (
		<li key={ `${ image.id }-${ index }` } className="mab-logos__item">
			<img src={ image.url } alt={ image.alt } loading="lazy" decoding="async" />
		</li>
	) );

	// The second list is an identical copy that makes the loop seamless;
	// it is hidden from assistive technology.
	return (
		<div { ...blockProps }>
			<div className="mab-logos__track">
				<ul className="mab-logos__list">{ items }</ul>
				<ul className="mab-logos__list mab-logos__list--copy" aria-hidden="true">
					{ items }
				</ul>
			</div>
		</div>
	);
}
