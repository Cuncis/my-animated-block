import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { FaqAttributes } from './types';

const ITEM = 'my-animated-block/faq-item';
const TEMPLATE: [ string ][] = [ [ ITEM ], [ ITEM ], [ ITEM ] ];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< FaqAttributes > ) {
	const blockProps = useBlockProps( { className: 'mab-faq' } );
	const innerProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ ITEM ],
		template: TEMPLATE,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Search engines', 'my-animated-block' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Output FAQ structured data', 'my-animated-block' ) }
						help={ __(
							'Adds FAQPage JSON-LD so Google can understand the questions. Use it on one FAQ block per page.',
							'my-animated-block'
						) }
						checked={ attributes.schema }
						onChange={ ( value: boolean ) =>
							setAttributes( { schema: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerProps } />
		</>
	);
}
