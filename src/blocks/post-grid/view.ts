/** Category filter: shows or hides the already-loaded cards. No requests. */
function init( root: HTMLElement ): void {
	const buttons = Array.from(
		root.querySelectorAll< HTMLButtonElement >( '.mab-posts__filter' )
	);
	const cards = Array.from( root.querySelectorAll< HTMLElement >( '.mab-post' ) );

	if ( buttons.length === 0 ) {
		return;
	}

	buttons.forEach( ( button ) => {
		button.addEventListener( 'click', () => {
			const filter = button.dataset.filter ?? '';

			buttons.forEach( ( other ) => {
				const active = other === button;
				other.classList.toggle( 'is-active', active );
				other.setAttribute( 'aria-pressed', String( active ) );
			} );

			cards.forEach( ( card ) => {
				const cats = ( card.dataset.cats ?? '' ).split( ' ' );
				card.hidden = filter !== '' && ! cats.includes( filter );
			} );
		} );
	} );
}

function boot(): void {
	document.querySelectorAll< HTMLElement >( '.mab-posts' ).forEach( init );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', boot, { once: true } );
} else {
	boot();
}

// Marks this file as a module so its helpers stay out of the global scope.
export {};
