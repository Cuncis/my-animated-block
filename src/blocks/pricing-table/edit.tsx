import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { PricingTableAttributes } from './types';

const PLAN = 'my-animated-block/pricing-plan';

const TEMPLATE: [ string, Record< string, unknown > ][] = [
	[ PLAN, { name: 'Starter', priceMonthly: '9', priceYearly: '90' } ],
	[
		PLAN,
		{
			name: 'Pro',
			priceMonthly: '29',
			priceYearly: '290',
			highlighted: true,
		},
	],
	[ PLAN, { name: 'Business', priceMonthly: '79', priceYearly: '790' } ],
];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< PricingTableAttributes > ) {
	const { showToggle, monthlyLabel, yearlyLabel } = attributes;

	const blockProps = useBlockProps( { className: 'mab-pricing' } );
	const innerProps = useInnerBlocksProps(
		{ className: 'mab-pricing__plans' },
		{ allowedBlocks: [ PLAN ], template: TEMPLATE, orientation: 'horizontal' }
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Billing toggle', 'my-animated-block' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Show monthly / yearly toggle', 'my-animated-block' ) }
						checked={ showToggle }
						onChange={ ( value: boolean ) =>
							setAttributes( { showToggle: value } )
						}
					/>
					{ showToggle ? (
						<>
							<TextControl
								__next40pxDefaultSize
								label={ __( 'Monthly label', 'my-animated-block' ) }
								value={ monthlyLabel }
								onChange={ ( value: string ) =>
									setAttributes( { monthlyLabel: value } )
								}
							/>
							<TextControl
								__next40pxDefaultSize
								label={ __( 'Yearly label', 'my-animated-block' ) }
								value={ yearlyLabel }
								onChange={ ( value: string ) =>
									setAttributes( { yearlyLabel: value } )
								}
							/>
						</>
					) : null }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ showToggle ? (
					<div className="mab-pricing__toggle mab-pricing__toggle--preview">
						<span className="mab-pricing__toggle-btn is-active">
							{ monthlyLabel }
						</span>
						<span className="mab-pricing__toggle-btn">{ yearlyLabel }</span>
					</div>
				) : null }
				<div { ...innerProps } />
			</div>
		</>
	);
}
