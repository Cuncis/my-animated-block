import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import type { SiteHeaderAttributes } from './types';

import './style.css';
import './editor.css';

registerBlockType< SiteHeaderAttributes >(
	metadata as unknown as BlockConfiguration< SiteHeaderAttributes >,
	// Rendered on the server (render.php).
	{ edit: Edit, save: () => null }
);
