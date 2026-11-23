import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { FeatureGridAttributes } from './types';

const ITEM = 'my-animated-block/feature-item';

const TEMPLATE: [ string ][] = [ [ ITEM ], [ ITEM ], [ ITEM ] ];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< FeatureGridAttributes > ) {
	const { columns } = attributes;

	const blockProps = useBlockProps( {
		className: `mab-feature-grid mab-feature-grid--cols-${ columns }`,
	} );
	const innerProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ ITEM ],
		template: TEMPLATE,
		orientation: 'horizontal',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Grid', 'my-animated-block' ) }>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Columns', 'my-animated-block' ) }
						value={ columns }
						min={ 1 }
						max={ 4 }
						onChange={ ( value?: number ) =>
							setAttributes( { columns: value ?? 3 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerProps } />
		</>
	);
}
