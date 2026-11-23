export type MediaLightboxAttributes = {
	kind: 'image' | 'video';
	imageUrl: string;
	fullUrl: string;
	imageId?: number;
	alt: string;
	videoUrl: string;
	ratio: '16/9' | '4/3' | '1/1' | 'auto';
	caption: string;
};
