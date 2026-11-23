export type HeroAttributes = {
	mediaType: 'image' | 'video';
	mediaUrl: string;
	mediaId?: number;
	mediaAlt: string;
	overlay: number;
	minHeight: number;
	textAlign: 'left' | 'center';
};
