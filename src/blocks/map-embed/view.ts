/** Replaces the placeholder with a Google Maps iframe only after a click. */
function init( root: HTMLElement ): void {
	const button = root.querySelector< HTMLButtonElement >( '.mab-map__load' );
	const query = root.dataset.query ?? '';
	if ( ! button || ! query ) {
		return;
	}

	button.addEventListener( 'click', () => {
		const iframe = document.createElement( 'iframe' );
		iframe.className = 'mab-map__frame';
		iframe.src = `https://www.google.com/maps?q=${ encodeURIComponent( query ) }&output=embed`;
		iframe.title = root.dataset.title || 'Map';
		iframe.loading = 'lazy';
		iframe.referrerPolicy = 'no-referrer-when-downgrade';
		iframe.allowFullscreen = true;
		root.replaceChildren( iframe );
	} );
}

function boot(): void {
	document.querySelectorAll< HTMLElement >( '.mab-map' ).forEach( init );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', boot, { once: true } );
} else {
	boot();
}

// Marks this file as a module so its helpers stay out of the global scope.
export {};
