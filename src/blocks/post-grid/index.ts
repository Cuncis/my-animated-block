import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import type { PostGridAttributes } from './types';

import './style.css';

registerBlockType< PostGridAttributes >(
	metadata as unknown as BlockConfiguration< PostGridAttributes >,
	// Rendered on the server (render.php).
	{ edit: Edit, save: () => null }
);
