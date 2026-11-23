import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { FeatureItemAttributes } from './types';

registerBlockType< FeatureItemAttributes >(
	metadata as unknown as BlockConfiguration< FeatureItemAttributes >,
	{ edit: Edit, save }
);
