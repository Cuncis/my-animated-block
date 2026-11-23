import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import type { PricingTableAttributes } from './types';

export default function save( {
	attributes,
}: BlockSaveProps< PricingTableAttributes > ) {
	const { showToggle, monthlyLabel, yearlyLabel } = attributes;
	const blockProps = useBlockProps.save( {
		className: 'mab-pricing',
		'data-billing': 'monthly',
	} );

	return (
		<div { ...blockProps }>
			{ showToggle ? (
				<div
					className="mab-pricing__toggle"
					role="group"
					aria-label={ __( 'Billing period', 'my-animated-block' ) }
				>
					<button
						type="button"
						className="mab-pricing__toggle-btn is-active"
						data-billing="monthly"
						aria-pressed="true"
					>
						{ monthlyLabel }
					</button>
					<button
						type="button"
						className="mab-pricing__toggle-btn"
						data-billing="yearly"
						aria-pressed="false"
					>
						{ yearlyLabel }
					</button>
				</div>
			) : null }
			<div className="mab-pricing__plans">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
