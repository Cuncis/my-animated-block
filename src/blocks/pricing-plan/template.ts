import { __ } from '@wordpress/i18n';

type Template = [ string, Record< string, unknown >?, Template[]? ];

export const PLAN_ALLOWED_BLOCKS = [
	'core/list',
	'core/paragraph',
	'core/buttons',
	'core/separator',
];

export const PLAN_TEMPLATE: Template[] = [
	[
		'core/list',
		{},
		[
			[ 'core/list-item', { content: __( 'First feature', 'my-animated-block' ) } ],
			[ 'core/list-item', { content: __( 'Second feature', 'my-animated-block' ) } ],
			[ 'core/list-item', { content: __( 'Third feature', 'my-animated-block' ) } ],
		],
	],
	[
		'core/buttons',
		{},
		[ [ 'core/button', { text: __( 'Choose plan', 'my-animated-block' ) } ] ],
	],
];
