import type { StatItemAttributes } from './types';

/** Same markup in the editor and in saved content. */
export default function Value( {
	value,
	decimals,
	prefix,
	suffix,
}: Pick< StatItemAttributes, 'value' | 'decimals' | 'prefix' | 'suffix' > ) {
	return (
		<div
			className="mab-stat__value"
			data-value={ String( value ) }
			data-decimals={ String( decimals ) }
		>
			{ prefix ? <span className="mab-stat__prefix">{ prefix }</span> : null }
			<span className="mab-stat__number">{ value.toFixed( decimals ) }</span>
			{ suffix ? <span className="mab-stat__suffix">{ suffix }</span> : null }
		</div>
	);
}
