import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { TestimonialsAttributes } from './types';

import './style.css';

registerBlockType< TestimonialsAttributes >(
	metadata as unknown as BlockConfiguration< TestimonialsAttributes >,
	{ edit: Edit, save }
);
