import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import Price from './Price';
import type { PricingPlanAttributes } from './types';

export default function save( {
	attributes,
}: BlockSaveProps< PricingPlanAttributes > ) {
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

	const blockProps = useBlockProps.save( {
		className: `mab-plan${ highlighted ? ' is-highlighted' : '' }`,
	} );

	return (
		<div { ...blockProps }>
			{ highlighted && badge ? (
				<span className="mab-plan__badge">{ badge }</span>
			) : null }
			<RichText.Content tagName="h3" className="mab-plan__name" value={ name } />
			<RichText.Content
				tagName="p"
				className="mab-plan__description"
				value={ description }
			/>
			<Price
				kind="monthly"
				currency={ currency }
				amount={ priceMonthly }
				period={ periodMonthly }
			/>
			{ priceYearly ? (
				<Price
					kind="yearly"
					currency={ currency }
					amount={ priceYearly }
					period={ periodYearly }
				/>
			) : null }
			<div className="mab-plan__body">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
