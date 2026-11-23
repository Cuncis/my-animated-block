import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { StatsAttributes } from './types';

import './style.css';

registerBlockType< StatsAttributes >(
	metadata as unknown as BlockConfiguration< StatsAttributes >,
	{ edit: Edit, save }
);
