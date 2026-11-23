/**
 * Billing toggle. Plain DOM, no dependencies.
 * Progressive enhancement: the toggle is hidden by CSS until this script
 * adds `has-js`, so without JavaScript visitors simply see monthly prices.
 */
function init( root: HTMLElement ): void {
	const buttons = Array.from(
		root.querySelectorAll< HTMLButtonElement >( '.mab-pricing__toggle-btn' )
	);

	if ( buttons.length === 0 ) {
		return;
	}

	root.classList.add( 'has-js' );

	buttons.forEach( ( button ) => {
		button.addEventListener( 'click', () => {
			const billing = button.dataset.billing === 'yearly' ? 'yearly' : 'monthly';
			root.dataset.billing = billing;

			buttons.forEach( ( other ) => {
				const active = other === button;
				other.classList.toggle( 'is-active', active );
				other.setAttribute( 'aria-pressed', String( active ) );
			} );
		} );
	} );
}

function boot(): void {
	document
		.querySelectorAll< HTMLElement >( '.mab-pricing' )
		.forEach( init );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', boot, { once: true } );
} else {
	boot();
}

// Marks this file as a module so its helpers stay out of the global scope.
export {};
