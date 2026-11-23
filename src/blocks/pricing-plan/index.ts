import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { PricingPlanAttributes } from './types';

registerBlockType< PricingPlanAttributes >(
	metadata as unknown as BlockConfiguration< PricingPlanAttributes >,
	{ edit: Edit, save }
);
