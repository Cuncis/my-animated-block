/**
 * Scroll reveal. Markup is visible by default (no-JS safe); this hides
 * elements that are below the fold, then reveals them as they scroll in.
 * Elements already on screen play a short intro animation instead.
 */
const reduced = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

function presetOf( el: HTMLElement, prefix: string ): string {
	const match = new RegExp( `${ prefix }--([a-z]+)` ).exec( el.className );
	return match?.[ 1 ] ?? 'up';
}

function boot(): void {
	if ( reduced || ! ( 'IntersectionObserver' in window ) ) {
		return;
	}
	const vh = window.innerHeight;
	const targets: HTMLElement[] = [];

	// Stagger containers hand their children a rising delay.
	document.querySelectorAll< HTMLElement >( '.mab-stagger' ).forEach( ( box ) => {
		const preset = presetOf( box, 'mab-stagger' );
		const base = parseInt( box.style.getPropertyValue( '--mab-delay' ) || '0', 10 );
		Array.from( box.children ).forEach( ( child, i ) => {
			const el = child as HTMLElement;
			el.classList.add( 'mab-fx', `mab-fx--${ preset }` );
			el.style.setProperty( '--mab-delay', `${ base + Math.min( i, 6 ) * 100 }ms` );
			targets.push( el );
		} );
	} );
	document.querySelectorAll< HTMLElement >( '.mab-fx' ).forEach( ( el ) => {
		if ( ! targets.includes( el ) ) {
			targets.push( el );
		}
	} );

	const io = new IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					entry.target.classList.add( 'mab-in' );
					io.unobserve( entry.target );
				}
			} );
		},
		{ threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
	);

	targets.forEach( ( el ) => {
		const rect = el.getBoundingClientRect();
		if ( rect.top < vh * 0.9 && rect.bottom > 0 ) {
			el.classList.add( 'mab-intro' );
			return;
		}
		el.classList.add( 'mab-hide' );
		io.observe( el );
	} );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', boot );
} else {
	boot();
}

export {};
