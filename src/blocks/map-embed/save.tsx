import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { CSSProperties } from 'react';
import type { MapAttributes } from './types';

export default function save( { attributes }: BlockSaveProps< MapAttributes > ) {
	const { query, height, title, buttonText } = attributes;

	if ( ! query ) {
		return null;
	}

	const blockProps = useBlockProps.save( {
		className: 'mab-map',
		'data-query': query,
		'data-title': title,
		style: { '--mab-map-h': `${ height }px` } as CSSProperties,
	} );

	return (
		<div { ...blockProps }>
			<div className="mab-map__placeholder">
				<p className="mab-map__address">{ query }</p>
				<div className="mab-map__actions">
					<button type="button" className="mab-map__load">
						{ buttonText }
					</button>
					<a
						className="mab-map__open"
						href={ `https://www.google.com/maps/search/?api=1&query=${ encodeURIComponent( query ) }` }
						target="_blank"
						rel="noopener noreferrer"
					>
						Open in Google Maps
					</a>
				</div>
				<p className="mab-map__note">Loading the map connects to Google.</p>
			</div>
		</div>
	);
}
