import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';
import type { BlockEditProps } from '@wordpress/blocks';
import type { SiteHeaderAttributes } from './types';

interface NavMenu {
	id: number;
	name: string;
}

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< SiteHeaderAttributes > ) {
	const { menuId, sticky, ctaText, ctaUrl, logoWidth } = attributes;
	const blockProps = useBlockProps();

	const menus = useSelect( ( select ) => {
		const core = select( 'core' ) as {
			getEntityRecords: (
				kind: string,
				name: string,
				query?: Record< string, unknown >
			) => NavMenu[] | null;
		};
		return core.getEntityRecords( 'root', 'menu', { per_page: -1 } ) ?? [];
	}, [] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Navigation', 'my-animated-block' ) }>
					<SelectControl
						__next40pxDefaultSize
						label={ __( 'Menu', 'my-animated-block' ) }
						help={ __(
							'Create menus under Appearance → Menus. Give a top-level item the CSS class "mab-mega" to open its sub-items as a wide mega-menu panel.',
							'my-animated-block'
						) }
						value={ String( menuId ) }
						options={ [
							{
								value: '0',
								label: __( 'Theme "Header" menu location', 'my-animated-block' ),
							},
							...menus.map( ( menu ) => ( {
								value: String( menu.id ),
								label: menu.name,
							} ) ),
						] }
						onChange={ ( value: string ) =>
							setAttributes( { menuId: Number.parseInt( value, 10 ) || 0 } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Button', 'my-animated-block' ) }>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Button text (empty hides it)', 'my-animated-block' ) }
						value={ ctaText }
						onChange={ ( value: string ) => setAttributes( { ctaText: value } ) }
					/>
					<TextControl
						__next40pxDefaultSize
						type="url"
						label={ __( 'Button link', 'my-animated-block' ) }
						value={ ctaUrl }
						onChange={ ( value: string ) => setAttributes( { ctaUrl: value } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Behaviour', 'my-animated-block' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Stick to the top while scrolling', 'my-animated-block' ) }
						help={ __(
							'Place the header as the first block on the page so it can stay in view.',
							'my-animated-block'
						) }
						checked={ sticky }
						onChange={ ( value: boolean ) => setAttributes( { sticky: value } ) }
					/>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Logo width (px)', 'my-animated-block' ) }
						value={ logoWidth }
						min={ 60 }
						max={ 320 }
						onChange={ ( value?: number ) =>
							setAttributes( { logoWidth: value ?? 140 } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block="my-animated-block/site-header"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
