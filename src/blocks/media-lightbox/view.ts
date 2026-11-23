/**
 * One delegated click handler for every lightbox on the page.
 * The popup is a native <dialog> (focus trap, Esc to close, inert page).
 * Videos are created only on click, so nothing from YouTube / Vimeo is
 * loaded until the visitor asks for it.
 */
function youtubeId( url: URL ): string | null {
	const host = url.hostname.replace( /^www\./, '' );
	if ( host === 'youtu.be' ) {
		return url.pathname.slice( 1 ).split( '/' )[ 0 ] || null;
	}
	if ( host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com' ) {
		if ( url.pathname === '/watch' ) {
			return url.searchParams.get( 'v' );
		}
		const match = url.pathname.match( /^\/(?:embed|shorts|live)\/([\w-]{6,})/ );
		return match?.[ 1 ] ?? null;
	}
	return null;
}

function vimeoId( url: URL ): string | null {
	if ( url.hostname.replace( /^www\./, '' ) !== 'vimeo.com' ) {
		return null;
	}
	const match = url.pathname.match( /^\/(?:video\/)?(\d+)/ );
	return match?.[ 1 ] ?? null;
}

/** Builds the element to show for a video URL, or null if unsupported. */
function buildVideo( src: string ): HTMLElement | null {
	let url: URL;
	try {
		url = new URL( src, window.location.href );
	} catch {
		return null;
	}
	if ( url.protocol !== 'https:' && url.protocol !== 'http:' ) {
		return null;
	}

	const yt = youtubeId( url );
	const vimeo = yt ? null : vimeoId( url );
	if ( yt || vimeo ) {
		const iframe = document.createElement( 'iframe' );
		iframe.src = yt
			? `https://www.youtube-nocookie.com/embed/${ encodeURIComponent( yt ) }?autoplay=1&rel=0`
			: `https://player.vimeo.com/video/${ encodeURIComponent( vimeo ?? '' ) }?autoplay=1`;
		iframe.allow = 'autoplay; fullscreen; picture-in-picture';
		iframe.allowFullscreen = true;
		iframe.title = 'Video';
		iframe.className = 'mab-lightbox__frame';
		return iframe;
	}

	if ( /\.(mp4|webm|ogg)$/i.test( url.pathname ) ) {
		const video = document.createElement( 'video' );
		video.src = url.href;
		video.controls = true;
		video.autoplay = true;
		video.playsInline = true;
		video.className = 'mab-lightbox__frame';
		return video;
	}

	return null;
}

let dialog: HTMLDialogElement | null = null;
let body: HTMLElement | null = null;

function ensureDialog(): HTMLDialogElement {
	if ( dialog && body ) {
		return dialog;
	}

	dialog = document.createElement( 'dialog' );
	dialog.className = 'mab-lightbox';
	dialog.setAttribute( 'aria-label', 'Media viewer' );

	const close = document.createElement( 'button' );
	close.type = 'button';
	close.className = 'mab-lightbox__close';
	close.setAttribute( 'aria-label', 'Close' );
	close.textContent = '×';
	close.addEventListener( 'click', () => dialog?.close() );

	body = document.createElement( 'div' );
	body.className = 'mab-lightbox__body';

	dialog.append( close, body );
	// Clicking the dark backdrop (the dialog element itself) closes it.
	dialog.addEventListener( 'click', ( event ) => {
		if ( event.target === dialog ) {
			dialog?.close();
		}
	} );
	// Removing the content also stops any playing video.
	dialog.addEventListener( 'close', () => body?.replaceChildren() );
	document.body.appendChild( dialog );

	return dialog;
}

function open( trigger: HTMLElement ): void {
	const src = trigger.dataset.src ?? '';
	if ( ! src ) {
		return;
	}

	let content: HTMLElement | null = null;
	if ( trigger.dataset.kind === 'video' ) {
		content = buildVideo( src );
		if ( ! content ) {
			// Unsupported video host: open it in a new tab, but only ever
			// http(s) links (never javascript:, data: and similar).
			try {
				const url = new URL( src, window.location.href );
				if ( url.protocol === 'https:' || url.protocol === 'http:' ) {
					window.open( url.href, '_blank', 'noopener,noreferrer' );
				}
			} catch {
				// Not a valid URL: do nothing.
			}
			return;
		}
	} else {
		const img = document.createElement( 'img' );
		img.src = src;
		img.alt = trigger.dataset.alt ?? '';
		img.className = 'mab-lightbox__image';
		content = img;
	}

	const el = ensureDialog();
	body?.replaceChildren( content );
	el.showModal();
}

document.addEventListener( 'click', ( event ) => {
	const target = event.target;
	if ( ! ( target instanceof Element ) ) {
		return;
	}
	const trigger = target.closest< HTMLElement >( '.mab-media__trigger' );
	if ( trigger && trigger.tagName === 'BUTTON' ) {
		event.preventDefault();
		open( trigger );
	}
} );

// Marks this file as a module so its helpers stay out of the global scope.
export {};
