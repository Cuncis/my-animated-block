/**
 * Progressive enhancement for the slider layout. The markup is a native
 * scroll-snap track that works without JavaScript; this adds previous / next
 * arrows, pagination dots and optional autoplay on top of it.
 */
const ARROW_PREV =
	'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ARROW_NEXT =
	'<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function button( className: string, label: string ): HTMLButtonElement {
	const el = document.createElement( 'button' );
	el.type = 'button';
	el.className = className;
	el.setAttribute( 'aria-label', label );
	return el;
}

function init( root: HTMLElement ): void {
	if ( root.classList.contains( 'has-js' ) ) {
		return;
	}
	const track = root.querySelector< HTMLElement >( ':scope > .mab-testimonials__track' );
	if ( ! track ) {
		return;
	}
	const items = Array.from( track.children ) as HTMLElement[];
	if ( items.length < 2 ) {
		return;
	}
	root.classList.add( 'has-js' );

	const showArrows = root.dataset.arrows !== '0';
	const showDots = root.dataset.dots !== '0';
	const autoplayMs = Number( root.dataset.autoplay || 0 );
	const reduced = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;

	const nav = document.createElement( 'div' );
	nav.className = 'mab-testimonials__nav';
	const prev = button( 'mab-testimonials__arrow mab-testimonials__arrow--prev', 'Previous testimonials' );
	const next = button( 'mab-testimonials__arrow mab-testimonials__arrow--next', 'Next testimonials' );
	prev.innerHTML = ARROW_PREV;
	next.innerHTML = ARROW_NEXT;
	const dotsWrap = document.createElement( 'div' );
	dotsWrap.className = 'mab-testimonials__dots';
	if ( showArrows ) {
		nav.appendChild( prev );
	}
	if ( showDots ) {
		nav.appendChild( dotsWrap );
	}
	if ( showArrows ) {
		nav.appendChild( next );
	}
	if ( showArrows || showDots ) {
		root.appendChild( nav );
	}

	let pages = 1;
	let perPage = 1;
	let dots: HTMLButtonElement[] = [];

	function metrics(): void {
		const first = items[ 0 ] as HTMLElement;
		const gap = parseFloat( getComputedStyle( track as HTMLElement ).columnGap ) || 0;
		const itemW = first.getBoundingClientRect().width + gap;
		perPage = Math.max( 1, Math.round( ( ( track as HTMLElement ).clientWidth + gap ) / itemW ) );
		const next = Math.max( 1, Math.ceil( items.length / perPage ) );
		if ( next !== pages || dots.length !== next ) {
			pages = next;
			dotsWrap.textContent = '';
			dots = Array.from( { length: pages }, ( _, i ) => {
				const d = button( 'mab-testimonials__dot', `Go to slide ${ i + 1 }` );
				d.addEventListener( 'click', () => goTo( i ) );
				dotsWrap.appendChild( d );
				return d;
			} );
		}
		nav.hidden = pages < 2;
	}

	function pageWidth(): number {
		const first = items[ 0 ] as HTMLElement;
		const gap = parseFloat( getComputedStyle( track as HTMLElement ).columnGap ) || 0;
		return ( first.getBoundingClientRect().width + gap ) * perPage;
	}

	function current(): number {
		const t = track as HTMLElement;
		if ( t.scrollLeft + t.clientWidth >= t.scrollWidth - 4 ) {
			return pages - 1;
		}
		return Math.min( pages - 1, Math.round( t.scrollLeft / pageWidth() ) );
	}

	function goTo( page: number ): void {
		const target = Math.max( 0, Math.min( pages - 1, page ) );
		( track as HTMLElement ).scrollTo( {
			left: target * pageWidth(),
			behavior: reduced ? 'auto' : 'smooth',
		} );
	}

	function update(): void {
		const index = current();
		dots.forEach( ( d, i ) => {
			d.classList.toggle( 'is-active', i === index );
			if ( i === index ) {
				d.setAttribute( 'aria-current', 'true' );
			} else {
				d.removeAttribute( 'aria-current' );
			}
		} );
		prev.disabled = index === 0;
		next.disabled = index === pages - 1;
	}

	let raf = 0;
	track.addEventListener( 'scroll', () => {
		cancelAnimationFrame( raf );
		raf = requestAnimationFrame( update );
	}, { passive: true } );
	prev.addEventListener( 'click', () => goTo( current() - 1 ) );
	next.addEventListener( 'click', () => goTo( current() + 1 ) );
	if ( 'ResizeObserver' in window ) {
		new ResizeObserver( () => {
			metrics();
			update();
		} ).observe( track );
	}
	metrics();
	update();

	if ( autoplayMs > 0 && ! reduced ) {
		let timer = 0;
		let paused = false;
		const tick = () => {
			if ( paused || document.hidden || pages < 2 ) {
				return;
			}
			goTo( current() >= pages - 1 ? 0 : current() + 1 );
		};
		const start = () => {
			window.clearInterval( timer );
			timer = window.setInterval( tick, autoplayMs );
		};
		const pause = ( value: boolean ) => () => {
			paused = value;
		};
		root.addEventListener( 'mouseenter', pause( true ) );
		root.addEventListener( 'mouseleave', pause( false ) );
		root.addEventListener( 'focusin', pause( true ) );
		root.addEventListener( 'focusout', pause( false ) );
		start();
	}
}

function boot(): void {
	document
		.querySelectorAll< HTMLElement >( '.mab-testimonials--slider' )
		.forEach( init );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', boot );
} else {
	boot();
}
