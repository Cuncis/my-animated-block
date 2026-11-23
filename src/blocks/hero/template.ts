import { __ } from '@wordpress/i18n';

type Template = [ string, Record< string, unknown >?, Template[]? ];

export const HERO_ALLOWED_BLOCKS = [
	'core/heading',
	'core/paragraph',
	'core/buttons',
	'core/image',
	'core/list',
	'core/spacer',
];

export const HERO_TEMPLATE: Template[] = [
	[
		'core/heading',
		{
			level: 1,
			content: __( 'A headline that earns attention', 'my-animated-block' ),
		},
	],
	[
		'core/paragraph',
		{
			content: __(
				'One or two sentences that explain what you do and who it is for.',
				'my-animated-block'
			),
		},
	],
	[
		'core/buttons',
		{},
		[
			[ 'core/button', { text: __( 'Get started', 'my-animated-block' ) } ],
			[
				'core/button',
				{
					text: __( 'Learn more', 'my-animated-block' ),
					className: 'is-style-outline',
				},
			],
		],
	],
];
