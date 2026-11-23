import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { HeroAttributes } from './types';

import './style.css';
import './editor.css';

registerBlockType< HeroAttributes >(
	metadata as unknown as BlockConfiguration< HeroAttributes >,
	{ edit: Edit, save }
);
