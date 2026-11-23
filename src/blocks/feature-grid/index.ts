import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { FeatureGridAttributes } from './types';

import './style.css';

registerBlockType< FeatureGridAttributes >(
	metadata as unknown as BlockConfiguration< FeatureGridAttributes >,
	{ edit: Edit, save }
);
