import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AnimationPreset, AnimationSettings } from './types';

gsap.registerPlugin( ScrollTrigger );

/** Root class WordPress generates from the block name. */
export const BLOCK_CLASS = 'wp-block-my-animated-block-animated-block';

/** Elements inside a block instance that take part in the animation. */
export const ANIMATE_ATTR = 'data-mab-animate';

export const PRESETS: readonly AnimationPreset[] = [
	'fade-up',
	'slide-in',
	'scale-in',
];

export const DEFAULT_SETTINGS: Readonly< AnimationSettings > = {
	preset: 'fade-up',
	duration: 0.8,
	stagger: 0.12,
};

export interface AnimationOptions extends AnimationSettings {
	/**
	 * true on the frontend: play once when the block scrolls into view.
	 * false in the editor: play immediately, because the editor canvas is an
	 * iframe whose scroller ScrollTrigger cannot observe from the parent window.
	 */
	useScrollTrigger: boolean;
}

function isPreset( value: unknown ): value is AnimationPreset {
	return (
		typeof value === 'string' &&
		( PRESETS as readonly string[] ).includes( value )
	);
}

function clamp( value: number, min: number, max: number ): number {
	return Math.min( Math.max( value, min ), max );
}

function toNumber( value: string | undefined, fallback: number ): number {
	if ( value === undefined ) {
		return fallback;
	}
	const parsed = Number.parseFloat( value );
	return Number.isFinite( parsed ) ? parsed : fallback;
}

/**
 * Reads and validates settings that save.tsx serialised onto the block root.
 *
 * @param root The block instance's wrapper element.
 * @return Sanitised settings, falling back to defaults for invalid values.
 */
export function readSettings( root: HTMLElement ): AnimationSettings {
	const { mabPreset, mabDuration, mabStagger } = root.dataset;

	return {
		preset: isPreset( mabPreset ) ? mabPreset : DEFAULT_SETTINGS.preset,
		duration: clamp(
			toNumber( mabDuration, DEFAULT_SETTINGS.duration ),
			0.1,
			3
		),
		stagger: clamp(
			toNumber( mabStagger, DEFAULT_SETTINGS.stagger ),
			0,
			1
		),
	};
}

function presetFromVars(
	preset: AnimationPreset,
	distance: number
): gsap.TweenVars {
	switch ( preset ) {
		case 'slide-in':
			return { x: -distance, autoAlpha: 0 };
		case 'scale-in':
			return { scale: 0.9, autoAlpha: 0 };
		case 'fade-up':
			return { y: distance, autoAlpha: 0 };
	}
}

/**
 * Animates ONE block instance. Every tween, ScrollTrigger and matchMedia
 * listener created here belongs to a gsap.context() scoped to `root`, so:
 *  - targets are looked up only inside this instance (no cross-block bleed);
 *  - the returned function reverts everything, restoring the original
 *    inline styles and removing ScrollTriggers and media-query listeners.
 *
 * @param root    The block instance's wrapper element (animation scope).
 * @param options Animation settings for this instance.
 * @return Cleanup function that reverts the whole GSAP context.
 */
export function createBlockAnimation(
	root: HTMLElement,
	options: AnimationOptions
): () => void {
	root.dataset.mabReady = 'false';

	const ctx = gsap.context( () => {
		// A matchMedia created inside a context is owned by that context,
		// so ctx.revert() below also tears it down.
		const mm = gsap.matchMedia();

		mm.add(
			{
				isDesktop: '(min-width: 782px)',
				reduceMotion: '(prefers-reduced-motion: reduce)',
			},
			( context ) => {
				const conditions = context.conditions ?? {};
				const targets = Array.from(
					root.querySelectorAll< HTMLElement >(
						`[${ ANIMATE_ATTR }]`
					)
				);

				if (
					targets.length === 0 ||
					conditions.reduceMotion === true
				) {
					root.dataset.mabReady = 'true';
					return;
				}

				const distance = conditions.isDesktop === true ? 48 : 24;
				const vars: gsap.TweenVars = {
					...presetFromVars( options.preset, distance ),
					duration: options.duration,
					stagger: options.stagger,
					ease: 'power3.out',
					onComplete: () => {
						root.dataset.mabReady = 'true';
					},
				};

				if ( options.useScrollTrigger ) {
					vars.scrollTrigger = {
						trigger: root,
						start: 'top 85%',
						once: true,
					};
				}

				gsap.from( targets, vars );
			}
		);
	}, root );

	return () => {
		ctx.revert();
		delete root.dataset.mabReady;
	};
}
