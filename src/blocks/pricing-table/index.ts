import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { PricingTableAttributes } from './types';

import './style.css';

registerBlockType< PricingTableAttributes >(
	metadata as unknown as BlockConfiguration< PricingTableAttributes >,
	{ edit: Edit, save }
);
