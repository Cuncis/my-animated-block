import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import Price from './Price';
import { PLAN_ALLOWED_BLOCKS, PLAN_TEMPLATE } from './template';
import type { PricingPlanAttributes } from './types';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< PricingPlanAttributes > ) {
	const {
		name,
		description,
		currency,
		priceMonthly,
		priceYearly,
		periodMonthly,
		periodYearly,
		highlighted,
		badge,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `mab-plan${ highlighted ? ' is-highlighted' : '' }`,
	} );
	const innerProps = useInnerBlocksProps(
		{ className: 'mab-plan__body' },
		{ allowedBlocks: PLAN_ALLOWED_BLOCKS, template: PLAN_TEMPLATE }
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Pricing', 'my-animated-block' ) }>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Currency symbol', 'my-animated-block' ) }
						value={ currency }
						onChange={ ( value: string ) => setAttributes( { currency: value } ) }
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Monthly price', 'my-animated-block' ) }
						value={ priceMonthly }
						onChange={ ( value: string ) =>
							setAttributes( { priceMonthly: value } )
						}
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Monthly period label', 'my-animated-block' ) }
						value={ periodMonthly }
						onChange={ ( value: string ) =>
							setAttributes( { periodMonthly: value } )
						}
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Yearly price', 'my-animated-block' ) }
						help={ __(
							'Leave empty to show the monthly price in both modes.',
							'my-animated-block'
						) }
						value={ priceYearly }
						onChange={ ( value: string ) =>
							setAttributes( { priceYearly: value } )
						}
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Yearly period label', 'my-animated-block' ) }
						value={ periodYearly }
						onChange={ ( value: string ) =>
							setAttributes( { periodYearly: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Highlight', 'my-animated-block' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Highlight this plan', 'my-animated-block' ) }
						checked={ highlighted }
						onChange={ ( value: boolean ) =>
							setAttributes( { highlighted: value } )
						}
					/>
					{ highlighted ? (
						<TextControl
							__next40pxDefaultSize
							label={ __( 'Badge text', 'my-animated-block' ) }
							value={ badge }
							onChange={ ( value: string ) => setAttributes( { badge: value } ) }
						/>
					) : null }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ highlighted && badge ? (
					<span className="mab-plan__badge">{ badge }</span>
				) : null }
				<RichText
					tagName="h3"
					className="mab-plan__name"
					value={ name }
					onChange={ ( value: string ) => setAttributes( { name: value } ) }
					placeholder={ __( 'Plan name', 'my-animated-block' ) }
					allowedFormats={ [] }
				/>
				<RichText
					tagName="p"
					className="mab-plan__description"
					value={ description }
					onChange={ ( value: string ) =>
						setAttributes( { description: value } )
					}
					placeholder={ __( 'Short description', 'my-animated-block' ) }
					allowedFormats={ [] }
				/>
				<Price
					kind="monthly"
					currency={ currency }
					amount={ priceMonthly }
					period={ periodMonthly }
				/>
				{ priceYearly ? (
					<p className="mab-plan__yearly-preview">
						{ __( 'Yearly:', 'my-animated-block' ) } { currency }
						{ priceYearly }
						{ periodYearly }
					</p>
				) : null }
				<div { ...innerProps } />
			</div>
		</>
	);
}
