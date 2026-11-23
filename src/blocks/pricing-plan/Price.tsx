interface Props {
	kind: 'monthly' | 'yearly';
	currency: string;
	amount: string;
	period: string;
}

/** Same markup for the editor preview and the saved output. */
export default function Price( { kind, currency, amount, period }: Props ) {
	return (
		<div className={ `mab-plan__price mab-plan__price--${ kind }` }>
			<span className="mab-plan__currency">{ currency }</span>
			<span className="mab-plan__amount">{ amount }</span>
			<span className="mab-plan__period">{ period }</span>
		</div>
	);
}
