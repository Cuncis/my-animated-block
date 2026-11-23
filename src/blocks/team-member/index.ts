import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { TeamMemberAttributes } from './types';

registerBlockType< TeamMemberAttributes >(
	metadata as unknown as BlockConfiguration< TeamMemberAttributes >,
	{ edit: Edit, save }
);
