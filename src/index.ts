import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { BlockAttributes } from './types';

import './style.css';
import './editor.css';

registerBlockType< BlockAttributes >(
	metadata as unknown as BlockConfiguration< BlockAttributes >,
	{
		edit: Edit,
		save,
	}
);
