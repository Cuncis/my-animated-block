import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type {
	SectionAttributes,
	SectionSpacing,
	SectionTag,
	SectionWidth,
} from './types';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< SectionAttributes > ) {
	const { tag, width, spacing } = attributes;

	const blockProps = useBlockProps( {
		className: `mab-section mab-section--space-${ spacing }`,
	} );
	const innerProps = useInnerBlocksProps( {
		className: `mab-section__inner mab-section__inner--${ width }`,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Section', 'my-animated-block' ) }>
					<SelectControl
						__next40pxDefaultSize
						label={ __( 'Content width', 'my-animated-block' ) }
						value={ width }
						options={ [
							{ value: 'narrow', label: __( 'Narrow (720px)', 'my-animated-block' ) },
							{ value: 'default', label: __( 'Default (1140px)', 'my-animated-block' ) },
							{ value: 'wide', label: __( 'Wide (1400px)', 'my-animated-block' ) },
							{ value: 'full', label: __( 'Full width', 'my-animated-block' ) },
						] }
						onChange={ ( value: string ) =>
							setAttributes( { width: value as SectionWidth } )
						}
					/>
					<SelectControl
						__next40pxDefaultSize
						label={ __( 'Vertical spacing', 'my-animated-block' ) }
						value={ spacing }
						options={ [
							{ value: 'none', label: __( 'None', 'my-animated-block' ) },
							{ value: 'sm', label: __( 'Small', 'my-animated-block' ) },
							{ value: 'md', label: __( 'Medium', 'my-animated-block' ) },
							{ value: 'lg', label: __( 'Large', 'my-animated-block' ) },
							{ value: 'xl', label: __( 'Extra large', 'my-animated-block' ) },
						] }
						onChange={ ( value: string ) =>
							setAttributes( { spacing: value as SectionSpacing } )
						}
					/>
					<SelectControl
						__next40pxDefaultSize
						label={ __( 'HTML element', 'my-animated-block' ) }
						value={ tag }
						options={ [ 'section', 'div', 'header', 'footer', 'main', 'aside' ].map(
							( value ) => ( { value, label: `<${ value }>` } )
						) }
						onChange={ ( value: string ) =>
							setAttributes( { tag: value as SectionTag } )
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
