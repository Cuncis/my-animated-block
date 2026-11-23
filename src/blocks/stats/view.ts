/**
 * Counts each number up from 0 the first time it scrolls into view.
 * The final value is already in the HTML, so crawlers, no-JS visitors and
 * people who prefer reduced motion all see the real number straight away.
 */
const DURATION_MS = 1600;

function easeOutCubic( t: number ): number {
	return 1 - Math.pow( 1 - t, 3 );
}

function animate( el: HTMLElement, target: number, decimals: number ): void {
	const number = el.querySelector< HTMLElement >( '.mab-stat__number' );
	if ( ! number ) {
		return;
	}

	const format = ( value: number ): string =>
		value.toLocaleString( undefined, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		} );

	const start = performance.now();
	const tick = ( now: number ): void => {
		const progress = Math.min( ( now - start ) / DURATION_MS, 1 );
		number.textContent = format( target * easeOutCubic( progress ) );
		if ( progress < 1 ) {
			requestAnimationFrame( tick );
		}
	};
	requestAnimationFrame( tick );
}

function boot(): void {
	const reduce =
		typeof window.matchMedia === 'function' &&
		window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	const values = Array.from(
		document.querySelectorAll< HTMLElement >( '.mab-stat__value' )
	);

	if ( reduce || values.length === 0 || ! ( 'IntersectionObserver' in window ) ) {
		return;
	}

	const observer = new IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( ! entry.isIntersecting ) {
					return;
				}
				const el = entry.target as HTMLElement;
				observer.unobserve( el );
				const target = Number.parseFloat( el.dataset.value ?? '' );
				const decimals = Math.min(
					4,
					Math.max( 0, Number.parseInt( el.dataset.decimals ?? '0', 10 ) || 0 )
				);
				if ( Number.isFinite( target ) ) {
					animate( el, target, decimals );
				}
			} );
		},
		{ threshold: 0.4 }
	);

	values.forEach( ( el ) => {
		const number = el.querySelector< HTMLElement >( '.mab-stat__number' );
		if ( number ) {
			number.textContent = '0';
		}
		observer.observe( el );
	} );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', boot, { once: true } );
} else {
	boot();
}

// Marks this file as a module so its helpers stay out of the global scope.
export {};
