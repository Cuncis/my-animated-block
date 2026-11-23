/**
 * "Overlay" panel for Group and Section blocks.
 *
 * Adds an overlay colour + opacity that sits above the block's own background
 * image / gradient and below its content, so light or dark tints can be laid
 * over a photo without a Cover block. The markup only changes when a colour
 * is chosen, so existing blocks stay valid.
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import {
	ColorPalette,
	InspectorControls,
	useSettings,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl, BaseControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { ComponentType } from 'react';

const BLOCKS = [ 'core/group', 'my-animated-block/section' ];
const DEFAULT_OPACITY = 50;

type OverlayAttrs = {
	mabOverlayColor?: string;
	mabOverlayOpacity?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record< string, any >;

function overlayStyle( attrs: OverlayAttrs ): Record< string, string > {
	if ( ! attrs.mabOverlayColor ) {
		return {};
	}
	const opacity = attrs.mabOverlayOpacity ?? DEFAULT_OPACITY;
	return {
		'--mab-overlay-color': attrs.mabOverlayColor,
		'--mab-overlay-opacity': String( opacity / 100 ),
	};
}

addFilter(
	'blocks.registerBlockType',
	'my-animated-block/overlay-attributes',
	( settings: AnyProps, name: string ) => {
		if ( ! BLOCKS.includes( name ) ) {
			return settings;
		}
		return {
			...settings,
			attributes: {
				...settings.attributes,
				mabOverlayColor: { type: 'string' },
				mabOverlayOpacity: { type: 'number', default: DEFAULT_OPACITY },
			},
		};
	}
);

const withOverlayControls = createHigherOrderComponent(
	( BlockEdit: ComponentType< AnyProps > ) => ( props: AnyProps ) => {
		const [ palette ] = useSettings( 'color.palette' ) as [ unknown ];
		if ( ! BLOCKS.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}
		const attrs = props.attributes as OverlayAttrs;
		const { setAttributes } = props;

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group="styles">
					<PanelBody
						title={ __( 'Overlay', 'my-animated-block' ) }
						initialOpen={ !! attrs.mabOverlayColor }
					>
						<BaseControl
							__nextHasNoMarginBottom
							id="mab-overlay-color"
							label={ __( 'Overlay colour', 'my-animated-block' ) }
							help={ __(
								'Tints the background image or gradient. Content stays on top.',
								'my-animated-block'
							) }
						>
							<ColorPalette
								colors={ ( palette as never ) ?? [] }
								value={ attrs.mabOverlayColor }
								onChange={ ( value?: string ) =>
									setAttributes( {
										mabOverlayColor: value || undefined,
									} )
								}
								clearable
							/>
						</BaseControl>
						{ attrs.mabOverlayColor ? (
							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Overlay opacity', 'my-animated-block' ) }
								value={ attrs.mabOverlayOpacity ?? DEFAULT_OPACITY }
								min={ 0 }
								max={ 100 }
								onChange={ ( value?: number ) =>
									setAttributes( {
										mabOverlayOpacity: value ?? DEFAULT_OPACITY,
									} )
								}
							/>
						) : null }
					</PanelBody>
				</InspectorControls>
			</>
		);
	},
	'withOverlayControls'
);

addFilter(
	'editor.BlockEdit',
	'my-animated-block/overlay-controls',
	withOverlayControls
);

// Live preview in the editor.
const withOverlayPreview = createHigherOrderComponent(
	( BlockListBlock: ComponentType< AnyProps > ) => ( props: AnyProps ) => {
		if ( ! BLOCKS.includes( props.name ) || ! props.attributes.mabOverlayColor ) {
			return <BlockListBlock { ...props } />;
		}
		return (
			<BlockListBlock
				{ ...props }
				className={ [ props.className, 'has-mab-overlay' ]
					.filter( Boolean )
					.join( ' ' ) }
				wrapperProps={ {
					...props.wrapperProps,
					style: {
						...( props.wrapperProps?.style ?? {} ),
						...overlayStyle( props.attributes ),
					},
				} }
			/>
		);
	},
	'withOverlayPreview'
);

addFilter(
	'editor.BlockListBlock',
	'my-animated-block/overlay-preview',
	withOverlayPreview
);

// Saved markup (only when an overlay colour is set).
addFilter(
	'blocks.getSaveContent.extraProps',
	'my-animated-block/overlay-save',
	( extraProps: AnyProps, blockType: { name: string }, attributes: OverlayAttrs ) => {
		if ( ! BLOCKS.includes( blockType.name ) || ! attributes.mabOverlayColor ) {
			return extraProps;
		}
		return {
			...extraProps,
			className: [ extraProps.className, 'has-mab-overlay' ]
				.filter( Boolean )
				.join( ' ' ),
			style: { ...( extraProps.style ?? {} ), ...overlayStyle( attributes ) },
		};
	}
);
