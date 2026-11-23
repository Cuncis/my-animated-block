import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { MapAttributes } from './types';

import './style.css';

registerBlockType< MapAttributes >(
	metadata as unknown as BlockConfiguration< MapAttributes >,
	{ edit: Edit, save }
);
