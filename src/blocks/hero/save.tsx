import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { HeroAttributes } from './types';

export default function save( { attributes }: BlockSaveProps< HeroAttributes > ) {
	const { mediaType, mediaUrl, mediaAlt, overlay, minHeight, textAlign } =
		attributes;

	const blockProps = useBlockProps.save( {
		className: `mab-hero mab-hero--${ textAlign }`,
		style: { minHeight: `${ minHeight }px` },
	} );

	return (
		<div { ...blockProps }>
			{ mediaUrl && mediaType === 'video' ? (
				<video
					className="mab-hero__media"
					src={ mediaUrl }
					autoPlay
					muted
					loop
					playsInline
					aria-hidden="true"
				/>
			) : null }
			{ mediaUrl && mediaType === 'image' ? (
				<img
					className="mab-hero__media"
					src={ mediaUrl }
					alt={ mediaAlt }
					decoding="async"
				/>
			) : null }
			<span
				className="mab-hero__overlay"
				style={ { opacity: overlay / 100 } }
				aria-hidden="true"
			/>
			<div className="mab-hero__content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
