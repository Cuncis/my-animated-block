import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { TestimonialsAttributes } from './types';

const ITEM = 'my-animated-block/testimonial-item';
const TEMPLATE: [ string ][] = [ [ ITEM ], [ ITEM ], [ ITEM ] ];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< TestimonialsAttributes > ) {
	const { layout, columns, showArrows, showDots, autoplay, autoplaySeconds } =
		attributes;

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
										'Visitors use arrows, dots or swipe. The editor previews it as a grid.',
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
				{ layout === 'slider' && (
					<PanelBody
						title={ __( 'Slider controls', 'my-animated-block' ) }
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Previous / next arrows', 'my-animated-block' ) }
							checked={ showArrows }
							onChange={ ( value: boolean ) =>
								setAttributes( { showArrows: value } )
							}
						/>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Pagination dots', 'my-animated-block' ) }
							checked={ showDots }
							onChange={ ( value: boolean ) =>
								setAttributes( { showDots: value } )
							}
						/>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Autoplay', 'my-animated-block' ) }
							help={ __(
								'Pauses on hover and for visitors who prefer reduced motion.',
								'my-animated-block'
							) }
							checked={ autoplay }
							onChange={ ( value: boolean ) =>
								setAttributes( { autoplay: value } )
							}
						/>
						{ autoplay && (
							<RangeControl
								__next40pxDefaultSize
								label={ __( 'Seconds per slide', 'my-animated-block' ) }
								value={ autoplaySeconds }
								min={ 2 }
								max={ 12 }
								onChange={ ( value?: number ) =>
									setAttributes( { autoplaySeconds: value ?? 5 } )
								}
							/>
						) }
					</PanelBody>
				) }
			</InspectorControls>
			<div { ...blockProps }>
				<div { ...innerProps } />
			</div>
		</>
	);
}
