import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { SectionAttributes } from './types';

import './style.css';
import './editor.css';

registerBlockType< SectionAttributes >(
	metadata as unknown as BlockConfiguration< SectionAttributes >,
	{ edit: Edit, save }
);
