import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';

import './style.css';
import './editor.css';

registerBlockType< Record< string, never > >(
	metadata as unknown as BlockConfiguration< Record< string, never > >,
	{ edit: Edit, save }
);
