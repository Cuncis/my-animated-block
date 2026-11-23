import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { TabItemAttributes } from './types';

registerBlockType< TabItemAttributes >(
	metadata as unknown as BlockConfiguration< TabItemAttributes >,
	{ edit: Edit, save }
);
