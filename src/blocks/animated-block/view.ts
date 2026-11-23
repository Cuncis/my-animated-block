import { BLOCK_CLASS, createBlockAnimation, readSettings } from './animation';

/**
 * Frontend entry (block.json "viewScript"). WordPress loads it only on
 * pages that contain the block.
 *
 * Each instance:
 *  - is initialised once (guarded by a WeakMap, so a second boot() call
 *    or a duplicate script tag cannot double-animate it);
 *  - reads its own data-* settings;
 *  - gets its own gsap.context + ScrollTrigger, scoped to its own root.
 */
const cleanups = new WeakMap< HTMLElement, () => void >();

function initBlock( root: HTMLElement ): void {
	if ( cleanups.has( root ) ) {
		return;
	}

	const cleanup = createBlockAnimation( root, {
		...readSettings( root ),
		useScrollTrigger: true,
	} );

	cleanups.set( root, cleanup );
}

function boot(): void {
	document
		.querySelectorAll< HTMLElement >( `.${ BLOCK_CLASS }` )
		.forEach( initBlock );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', boot, { once: true } );
} else {
	boot();
}
