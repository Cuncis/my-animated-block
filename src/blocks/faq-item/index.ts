import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { FaqItemAttributes } from './types';

registerBlockType< FaqItemAttributes >(
	metadata as unknown as BlockConfiguration< FaqItemAttributes >,
	{ edit: Edit, save }
);
