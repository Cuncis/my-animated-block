/**
 * "Motion" panel for (almost) any block: scroll-reveal preset, delay, stagger
 * for children, and a hover effect.
 *
 * The saved markup only carries marker classes; the frontend script adds the
 * hidden/visible state, so content is always visible without JavaScript and
 * in the editor. Blocks without motion settings save exactly what they did
 * before, so existing content stays valid.
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { ComponentType } from 'react';

const CORE_BLOCKS = [
	'core/group',
	'core/columns',
	'core/column',
	'core/image',
	'core/heading',
	'core/paragraph',
	'core/buttons',
	'core/cover',
	'core/media-text',
	'core/list',
	'core/gallery',
];

// Server-rendered blocks do not use the save() hooks, so they are excluded.
const DYNAMIC = [
	'my-animated-block/contact-form',
	'my-animated-block/faq',
	'my-animated-block/post-grid',
	'my-animated-block/site-header',
	'my-animated-block/animated-block',
];

function supports( name: string ): boolean {
	return (
		CORE_BLOCKS.includes( name ) ||
		( name.startsWith( 'my-animated-block/' ) && ! DYNAMIC.includes( name ) )
	);
}

type MotionAttrs = {
	mabReveal?: string;
	mabRevealDelay?: number;
	mabStagger?: boolean;
	mabHover?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record< string, any >;

const REVEALS = [
	{ value: '', label: __( 'None', 'my-animated-block' ) },
	{ value: 'up', label: __( 'Fade up', 'my-animated-block' ) },
	{ value: 'down', label: __( 'Fade down', 'my-animated-block' ) },
	{ value: 'left', label: __( 'Slide in from left', 'my-animated-block' ) },
	{ value: 'right', label: __( 'Slide in from right', 'my-animated-block' ) },
	{ value: 'zoom', label: __( 'Zoom in', 'my-animated-block' ) },
	{ value: 'fade', label: __( 'Fade', 'my-animated-block' ) },
];

const HOVERS = [
	{ value: '', label: __( 'None', 'my-animated-block' ) },
	{ value: 'lift', label: __( 'Lift', 'my-animated-block' ) },
	{ value: 'zoom', label: __( 'Zoom image', 'my-animated-block' ) },
	{ value: 'lift-zoom', label: __( 'Lift and zoom image', 'my-animated-block' ) },
	{ value: 'glow', label: __( 'Glow ring', 'my-animated-block' ) },
];

addFilter(
	'blocks.registerBlockType',
	'my-animated-block/motion-attributes',
	( settings: AnyProps, name: string ) => {
		if ( ! supports( name ) ) {
			return settings;
		}
		return {
			...settings,
			attributes: {
				...settings.attributes,
				mabReveal: { type: 'string' },
				mabRevealDelay: { type: 'number', default: 0 },
				mabStagger: { type: 'boolean', default: false },
				mabHover: { type: 'string' },
			},
		};
	}
);

const withMotionControls = createHigherOrderComponent(
	( BlockEdit: ComponentType< AnyProps > ) => ( props: AnyProps ) => {
		if ( ! supports( props.name ) ) {
			return <BlockEdit { ...props } />;
		}
		const a = props.attributes as MotionAttrs;
		const { setAttributes } = props;
		const active = !! ( a.mabReveal || a.mabHover );

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="styles">
					<PanelBody
						title={ __( 'Motion', 'my-animated-block' ) }
						initialOpen={ active }
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Scroll animation', 'my-animated-block' ) }
							value={ a.mabReveal ?? '' }
							options={ REVEALS }
							onChange={ ( value: string ) =>
								setAttributes( { mabReveal: value || undefined } )
							}
						/>
						{ a.mabReveal ? (
							<>
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __( 'Delay (ms)', 'my-animated-block' ) }
									value={ a.mabRevealDelay ?? 0 }
									min={ 0 }
									max={ 1500 }
									step={ 50 }
									onChange={ ( value?: number ) =>
										setAttributes( { mabRevealDelay: value ?? 0 } )
									}
								/>
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __(
										'Animate children one after another',
										'my-animated-block'
									) }
									help={ __(
										'Each direct child reveals in turn instead of the block as a whole. Good for columns and card grids.',
										'my-animated-block'
									) }
									checked={ !! a.mabStagger }
									onChange={ ( value: boolean ) =>
										setAttributes( { mabStagger: value } )
									}
								/>
							</>
						) : null }
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Hover effect', 'my-animated-block' ) }
							value={ a.mabHover ?? '' }
							options={ HOVERS }
							onChange={ ( value: string ) =>
								setAttributes( { mabHover: value || undefined } )
							}
						/>
					</PanelBody>
				</InspectorControls>
			</>
		);
	},
	'withMotionControls'
);

addFilter( 'editor.BlockEdit', 'my-animated-block/motion-controls', withMotionControls );

addFilter(
	'blocks.getSaveContent.extraProps',
	'my-animated-block/motion-save',
	( extraProps: AnyProps, blockType: { name: string }, attributes: MotionAttrs ) => {
		if ( ! supports( blockType.name ) ) {
			return extraProps;
		}
		const classes: string[] = [];
		const style: Record< string, string > = {};

		if ( attributes.mabReveal ) {
			if ( attributes.mabStagger ) {
				classes.push( 'mab-stagger', `mab-stagger--${ attributes.mabReveal }` );
			} else {
				classes.push( 'mab-fx', `mab-fx--${ attributes.mabReveal }` );
			}
			if ( attributes.mabRevealDelay ) {
				style[ '--mab-delay' ] = `${ attributes.mabRevealDelay }ms`;
			}
		}
		if ( attributes.mabHover ) {
			classes.push( 'mab-hover', `mab-hover--${ attributes.mabHover }` );
		}
		if ( ! classes.length ) {
			return extraProps;
		}
		return {
			...extraProps,
			className: [ extraProps.className, ...classes ].filter( Boolean ).join( ' ' ),
			...( Object.keys( style ).length
				? { style: { ...( extraProps.style ?? {} ), ...style } }
				: {} ),
		};
	}
);
