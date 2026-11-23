import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { TeamAttributes } from './types';

import './style.css';

registerBlockType< TeamAttributes >(
	metadata as unknown as BlockConfiguration< TeamAttributes >,
	{ edit: Edit, save }
);
