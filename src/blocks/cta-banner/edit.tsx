import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { CtaAttributes } from './types';

type Template = [ string, Record< string, unknown >?, Template[]? ];

const ALLOWED = [ 'core/heading', 'core/paragraph', 'core/buttons' ];

const TEMPLATE: Template[] = [
	[
		'core/heading',
		{ level: 2, content: __( 'Ready to get started?', 'my-animated-block' ) },
	],
	[
		'core/paragraph',
		{
			content: __(
				'Join today and see the difference for yourself.',
				'my-animated-block'
			),
		},
	],
	[
		'core/buttons',
		{},
		[ [ 'core/button', { text: __( 'Contact us', 'my-animated-block' ) } ] ],
	],
];

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< CtaAttributes > ) {
	const { layout } = attributes;

	const blockProps = useBlockProps( {
		className: `mab-cta mab-cta--${ layout }`,
	} );
	const innerProps = useInnerBlocksProps(
		{ className: 'mab-cta__inner' },
		{ allowedBlocks: ALLOWED, template: TEMPLATE }
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Layout', 'my-animated-block' ) }>
					<SelectControl
						__next40pxDefaultSize
						label={ __( 'Arrangement', 'my-animated-block' ) }
						value={ layout }
						options={ [
							{ value: 'center', label: __( 'Centered', 'my-animated-block' ) },
							{ value: 'split', label: __( 'Text left, buttons right', 'my-animated-block' ) },
						] }
						onChange={ ( value: string ) =>
							setAttributes( {
								layout: value === 'split' ? 'split' : 'center',
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div { ...innerProps } />
			</div>
		</>
	);
}
