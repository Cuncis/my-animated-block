import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import type { ContactFormAttributes } from './types';

import './style.css';

registerBlockType< ContactFormAttributes >(
	metadata as unknown as BlockConfiguration< ContactFormAttributes >,
	// Rendered on the server (render.php); nothing is stored in post_content.
	{ edit: Edit, save: () => null }
);
