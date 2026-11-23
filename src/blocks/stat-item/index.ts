import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { StatItemAttributes } from './types';

registerBlockType< StatItemAttributes >(
	metadata as unknown as BlockConfiguration< StatItemAttributes >,
	{ edit: Edit, save }
);
