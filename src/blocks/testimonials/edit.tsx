import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { TestimonialsAttributes } from './types';

const ITEM = 'my-animated-block/testimonial-item';
const TEMPLATE: [ string ][] = [ [ ITEM ], [ ITEM ], [ ITEM ] ];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< TestimonialsAttributes > ) {
	const { layout, columns } = attributes;

	// The editor always lays items out as a grid so every card stays
	// reachable; the slider behaviour only applies on the frontend.
	const blockProps = useBlockProps( {
		className: `mab-testimonials mab-testimonials--grid mab-testimonials--cols-${ columns }`,
	} );
	const innerProps = useInnerBlocksProps(
		{ className: 'mab-testimonials__track' },
		{ allowedBlocks: [ ITEM ], template: TEMPLATE, orientation: 'horizontal' }
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'my-animated-block' ) }>
					<SelectControl
						__next40pxDefaultSize
						label={ __( 'Display', 'my-animated-block' ) }
						value={ layout }
						help={
							layout === 'slider'
								? __(
										'Visitors swipe or scroll sideways. The editor previews it as a grid.',
										'my-animated-block'
								  )
								: undefined
						}
						options={ [
							{ value: 'grid', label: __( 'Grid', 'my-animated-block' ) },
							{ value: 'slider', label: __( 'Slider', 'my-animated-block' ) },
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								layout: value === 'slider' ? 'slider' : 'grid',
							} )
						}
					/>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Visible columns', 'my-animated-block' ) }
						value={ columns }
						min={ 1 }
						max={ 3 }
						onChange={ ( value?: number ) =>
							setAttributes( { columns: value ?? 3 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div { ...innerProps } />
			</div>
		</>
	);
}
