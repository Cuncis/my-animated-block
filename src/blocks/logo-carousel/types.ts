export type Logo = {
	id: number;
	url: string;
	alt: string;
};

export type LogoCarouselAttributes = {
	images: Logo[];
	speed: number;
	logoHeight: number;
	grayscale: boolean;
};
