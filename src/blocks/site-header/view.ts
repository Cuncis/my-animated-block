/** Mobile menu toggle, Esc to close, and a shadow once the page scrolls. */
function init( header: HTMLElement ): void {
	const toggle = header.querySelector< HTMLButtonElement >( '.mab-header__toggle' );
	const nav = header.querySelector< HTMLElement >( '.mab-header__nav' );

	function setOpen( open: boolean ): void {
		header.classList.toggle( 'is-open', open );
		toggle?.setAttribute( 'aria-expanded', String( open ) );
	}

	toggle?.addEventListener( 'click', () =>
		setOpen( ! header.classList.contains( 'is-open' ) )
	);

	header.addEventListener( 'keydown', ( event ) => {
		if ( event.key === 'Escape' && header.classList.contains( 'is-open' ) ) {
			setOpen( false );
			toggle?.focus();
		}
	} );

	// Close the mobile menu after following a link to the same page.
	nav?.addEventListener( 'click', ( event ) => {
		if ( event.target instanceof Element && event.target.closest( 'a' ) ) {
			setOpen( false );
		}
	} );

	if ( header.classList.contains( 'is-sticky' ) ) {
		const onScroll = (): void => {
			header.classList.toggle( 'is-scrolled', window.scrollY > 8 );
		};
		window.addEventListener( 'scroll', onScroll, { passive: true } );
		onScroll();
	}
}

function boot(): void {
	document.querySelectorAll< HTMLElement >( '.mab-header' ).forEach( init );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', boot, { once: true } );
} else {
	boot();
}

// Marks this file as a module so its helpers stay out of the global scope.
export {};
