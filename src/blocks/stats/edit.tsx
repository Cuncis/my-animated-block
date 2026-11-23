import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { StatsAttributes } from './types';

const ITEM = 'my-animated-block/stat-item';

const TEMPLATE: [ string, Record< string, unknown > ][] = [
	[ ITEM, { value: 1200, suffix: '+', label: 'Happy customers' } ],
	[ ITEM, { value: 98, suffix: '%', label: 'Satisfaction rate' } ],
	[ ITEM, { value: 15, suffix: '', label: 'Years of experience' } ],
	[ ITEM, { value: 24, suffix: '/7', label: 'Support' } ],
];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< StatsAttributes > ) {
	const { columns } = attributes;
	const blockProps = useBlockProps( {
		className: `mab-stats mab-stats--cols-${ columns }`,
	} );
	const innerProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: [ ITEM ],
		template: TEMPLATE,
		orientation: 'horizontal',
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'my-animated-block' ) }>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Columns', 'my-animated-block' ) }
						value={ columns }
						min={ 1 }
						max={ 4 }
						onChange={ ( value?: number ) =>
							setAttributes( { columns: value ?? 4 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerProps } />
		</>
	);
}
