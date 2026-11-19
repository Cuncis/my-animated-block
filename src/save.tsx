import { RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { BlockAttributes } from './types';

/**
 * Static markup stored in post_content. It must stay byte-for-byte stable:
 * any change to classes or structure needs a `deprecated` entry, or existing
 * blocks will fail validation.
 *
 * Animation settings go into data-* attributes on each instance's own root,
 * so view.ts reads per-instance config without global variables or IDs.
 *
 * @param props            Block save props.
 * @param props.attributes The block's attributes.
 */
export default function save( {
	attributes,
}: BlockSaveProps< BlockAttributes > ) {
	const { heading, body, preset, duration, stagger } = attributes;

	const blockProps = useBlockProps.save( {
		className:
			'tw-relative tw-overflow-hidden tw-rounded-2xl tw-px-6 tw-py-12 md:tw-px-12',
		'data-mab-preset': preset,
		'data-mab-duration': String( duration ),
		'data-mab-stagger': String( stagger ),
	} );

	return (
		<div { ...blockProps }>
			<div className="tw-mx-auto tw-flex tw-max-w-3xl tw-flex-col tw-gap-4">
				<span
					aria-hidden="true"
					className="tw-block tw-h-1 tw-w-16 tw-rounded-full tw-bg-current"
					data-mab-animate=""
				/>
				{ heading ? (
					<RichText.Content
						tagName="h2"
						className="wp-block-my-animated-block-animated-block__heading tw-m-0 tw-text-3xl tw-font-bold tw-leading-tight md:tw-text-5xl"
						value={ heading }
						data-mab-animate=""
					/>
				) : null }
				{ body ? (
					<RichText.Content
						tagName="p"
						className="wp-block-my-animated-block-animated-block__body tw-m-0 tw-text-lg tw-leading-relaxed tw-opacity-80"
						value={ body }
						data-mab-animate=""
					/>
				) : null }
			</div>
		</div>
	);
}
