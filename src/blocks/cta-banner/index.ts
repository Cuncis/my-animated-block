import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { CtaAttributes } from './types';

import './style.css';

registerBlockType< CtaAttributes >(
	metadata as unknown as BlockConfiguration< CtaAttributes >,
	{ edit: Edit, save }
);
