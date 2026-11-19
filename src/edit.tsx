import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import type { BlockEditProps } from '@wordpress/blocks';
import { createBlockAnimation, PRESETS } from './animation';
import type { AnimationPreset, BlockAttributes } from './types';

const PRESET_LABELS: Record< AnimationPreset, string > = {
	'fade-up': __( 'Fade up', 'my-animated-block' ),
	'slide-in': __( 'Slide in', 'my-animated-block' ),
	'scale-in': __( 'Scale in', 'my-animated-block' ),
};

function isPreset( value: string ): value is AnimationPreset {
	return ( PRESETS as readonly string[] ).includes( value );
}

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< BlockAttributes > ) {
	const { heading, body, preset, duration, stagger } = attributes;

	// Each block instance gets its own ref, so its GSAP context is
	// scoped to its own DOM node.
	const rootRef = useRef< HTMLDivElement >( null );
	const [ replayCount, setReplayCount ] = useState( 0 );

	const blockProps = useBlockProps( {
		ref: rootRef,
		className:
			'tw-relative tw-overflow-hidden tw-rounded-2xl tw-px-6 tw-py-12 md:tw-px-12',
	} );

	useEffect( () => {
		const root = rootRef.current;
		if ( ! root ) {
			return undefined;
		}

		// The returned cleanup calls ctx.revert(), which kills the tweens,
		// removes matchMedia listeners and restores the original inline
		// styles. It runs before every re-run and when the block unmounts.
		return createBlockAnimation( root, {
			preset,
			duration,
			stagger,
			useScrollTrigger: false,
		} );
		// heading/body are left out on purpose: typing must not replay the animation.
	}, [ preset, duration, stagger, replayCount ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Animation', 'my-animated-block' ) }>
					<SelectControl
						__next40pxDefaultSize
						label={ __( 'Preset', 'my-animated-block' ) }
						value={ preset }
						options={ PRESETS.map( ( value ) => ( {
							value,
							label: PRESET_LABELS[ value ],
						} ) ) }
						onChange={ ( value: string ) => {
							if ( isPreset( value ) ) {
								setAttributes( { preset: value } );
							}
						} }
					/>
					<RangeControl
						__next40pxDefaultSize
						label={ __(
							'Duration (seconds)',
							'my-animated-block'
						) }
						value={ duration }
						min={ 0.1 }
						max={ 3 }
						step={ 0.1 }
						onChange={ ( value?: number ) =>
							setAttributes( { duration: value ?? 0.8 } )
						}
					/>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Stagger (seconds)', 'my-animated-block' ) }
						value={ stagger }
						min={ 0 }
						max={ 1 }
						step={ 0.02 }
						onChange={ ( value?: number ) =>
							setAttributes( { stagger: value ?? 0.12 } )
						}
					/>
					<Button
						__next40pxDefaultSize
						variant="secondary"
						onClick={ () =>
							setReplayCount( ( count ) => count + 1 )
						}
					>
						{ __( 'Replay animation', 'my-animated-block' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="tw-mx-auto tw-flex tw-max-w-3xl tw-flex-col tw-gap-4">
					<span
						aria-hidden="true"
						className="tw-block tw-h-1 tw-w-16 tw-rounded-full tw-bg-current"
						data-mab-animate=""
					/>
					<RichText
						tagName="h2"
						className="wp-block-my-animated-block-animated-block__heading tw-m-0 tw-text-3xl tw-font-bold tw-leading-tight md:tw-text-5xl"
						value={ heading }
						onChange={ ( value: string ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __(
							'Add a heading…',
							'my-animated-block'
						) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
						data-mab-animate=""
					/>
					<RichText
						tagName="p"
						className="wp-block-my-animated-block-animated-block__body tw-m-0 tw-text-lg tw-leading-relaxed tw-opacity-80"
						value={ body }
						onChange={ ( value: string ) =>
							setAttributes( { body: value } )
						}
						placeholder={ __(
							'Add supporting text…',
							'my-animated-block'
						) }
						data-mab-animate=""
					/>
				</div>
			</div>
		</>
	);
}
