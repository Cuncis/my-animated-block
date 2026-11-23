import { RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { FeatureItemAttributes } from './types';

export default function save( {
	attributes,
}: BlockSaveProps< FeatureItemAttributes > ) {
	const { icon, iconUrl, title, text } = attributes;
	const blockProps = useBlockProps.save( { className: 'mab-feature' } );

	return (
		<div { ...blockProps }>
			{ iconUrl || icon ? (
				<div className="mab-feature__icon" aria-hidden="true">
					{ iconUrl ? (
						<img src={ iconUrl } alt="" loading="lazy" decoding="async" />
					) : (
						icon
					) }
				</div>
			) : null }
			<RichText.Content
				tagName="h3"
				className="mab-feature__title"
				value={ title }
			/>
			<RichText.Content
				tagName="p"
				className="mab-feature__text"
				value={ text }
			/>
		</div>
	);
}
