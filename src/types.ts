export type AnimationPreset = 'fade-up' | 'slide-in' | 'scale-in';

// A `type` alias (not an `interface`) so it satisfies the
// Record<string, unknown> constraint used by @wordpress/blocks generics.
export type BlockAttributes = {
	heading: string;
	body: string;
	preset: AnimationPreset;
	duration: number;
	stagger: number;
};

export type AnimationSettings = Pick<
	BlockAttributes,
	'preset' | 'duration' | 'stagger'
>;
