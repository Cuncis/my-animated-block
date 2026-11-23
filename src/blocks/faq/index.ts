import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { FaqAttributes } from './types';

import './style.css';

registerBlockType< FaqAttributes >(
	metadata as unknown as BlockConfiguration< FaqAttributes >,
	{ edit: Edit, save }
);
