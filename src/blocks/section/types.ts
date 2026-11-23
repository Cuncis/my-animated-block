export type SectionTag =
	| 'div'
	| 'section'
	| 'header'
	| 'footer'
	| 'main'
	| 'aside';
export type SectionWidth = 'narrow' | 'default' | 'wide' | 'full';
export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export type SectionAttributes = {
	tag: SectionTag;
	width: SectionWidth;
	spacing: SectionSpacing;
};
