import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { LogoCarouselAttributes } from './types';

import './style.css';
import './editor.css';

registerBlockType< LogoCarouselAttributes >(
	metadata as unknown as BlockConfiguration< LogoCarouselAttributes >,
	{ edit: Edit, save }
);
