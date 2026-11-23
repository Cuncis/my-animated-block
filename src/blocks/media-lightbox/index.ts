import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { MediaLightboxAttributes } from './types';

import './style.css';

registerBlockType< MediaLightboxAttributes >(
	metadata as unknown as BlockConfiguration< MediaLightboxAttributes >,
	{ edit: Edit, save }
);
