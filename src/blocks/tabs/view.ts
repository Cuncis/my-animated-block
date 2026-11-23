/**
 * Progressive enhancement: the markup is a plain list of titled panels.
 * This script builds an accessible tab bar (roles, roving tabindex, arrow /
 * Home / End keys) and hides the inactive panels.
 */
let uid = 0;

function init( root: HTMLElement ): void {
	if ( root.classList.contains( 'has-js' ) ) {
		return;
	}

	const panels = Array.from(
		root.querySelectorAll< HTMLElement >(
			':scope > .mab-tabs__panels > .mab-tab'
		)
	);
	if ( panels.length < 2 ) {
		return;
	}

	uid += 1;
	const nav = document.createElement( 'div' );
	nav.className = 'mab-tabs__nav';
	nav.setAttribute( 'role', 'tablist' );

	const tabs = panels.map( ( panel, index ) => {
		const title =
			panel
				.querySelector( '.mab-tab__title' )
				?.textContent?.trim() || `Tab ${ index + 1 }`;
		const tab = document.createElement( 'button' );
		tab.type = 'button';
		tab.className = 'mab-tabs__tab';
		tab.id = `mab-tab-${ uid }-${ index }`;
		tab.textContent = title;
		tab.setAttribute( 'role', 'tab' );
		panel.id = `mab-panel-${ uid }-${ index }`;
		tab.setAttribute( 'aria-controls', panel.id );
		panel.setAttribute( 'role', 'tabpanel' );
		panel.setAttribute( 'aria-labelledby', tab.id );
		nav.appendChild( tab );
		return tab;
	} );

	function select( index: number, focus: boolean ): void {
		tabs.forEach( ( tab, i ) => {
			const active = i === index;
			tab.setAttribute( 'aria-selected', String( active ) );
			tab.tabIndex = active ? 0 : -1;
			tab.classList.toggle( 'is-active', active );
			const panel = panels[ i ];
			if ( panel ) {
				panel.hidden = ! active;
			}
		} );
		if ( focus ) {
			tabs[ index ]?.focus();
		}
	}

	tabs.forEach( ( tab, index ) => {
		tab.addEventListener( 'click', () => select( index, false ) );
		tab.addEventListener( 'keydown', ( event ) => {
			const last = tabs.length - 1;
			let next = -1;
			switch ( event.key ) {
				case 'ArrowRight':
					next = index === last ? 0 : index + 1;
					break;
				case 'ArrowLeft':
					next = index === 0 ? last : index - 1;
					break;
				case 'Home':
					next = 0;
					break;
				case 'End':
					next = last;
					break;
				default:
					return;
			}
			event.preventDefault();
			select( next, true );
		} );
	} );

	root.insertBefore( nav, root.firstChild );
	root.classList.add( 'has-js' );
	select( 0, false );
}

function boot(): void {
	document.querySelectorAll< HTMLElement >( '.mab-tabs' ).forEach( init );
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', boot, { once: true } );
} else {
	boot();
}

// Marks this file as a module so its helpers stay out of the global scope.
export {};
