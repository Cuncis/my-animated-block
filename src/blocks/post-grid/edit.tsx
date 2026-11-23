import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import ServerSideRender from '@wordpress/server-side-render';
import type { BlockEditProps } from '@wordpress/blocks';
import type { PostGridAttributes } from './types';

interface Category {
	id: number;
	name: string;
}

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< PostGridAttributes > ) {
	const {
		count,
		columns,
		categoryIds,
		showFilters,
		showImage,
		showDate,
		showExcerpt,
		excerptLength,
	} = attributes;
	const blockProps = useBlockProps();

	const categories = useSelect( ( select ) => {
		const core = select( 'core' ) as {
			getEntityRecords: (
				kind: string,
				name: string,
				query?: Record< string, unknown >
			) => Category[] | null;
		};
		return (
			core.getEntityRecords( 'taxonomy', 'category', { per_page: -1 } ) ?? []
		);
	}, [] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Posts', 'my-animated-block' ) }>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Number of posts', 'my-animated-block' ) }
						value={ count }
						min={ 1 }
						max={ 24 }
						onChange={ ( value?: number ) => setAttributes( { count: value ?? 6 } ) }
					/>
					<RangeControl
						__next40pxDefaultSize
						label={ __( 'Columns', 'my-animated-block' ) }
						value={ columns }
						min={ 1 }
						max={ 4 }
						onChange={ ( value?: number ) => setAttributes( { columns: value ?? 3 } ) }
					/>
					<SelectControl
						multiple
						label={ __( 'Only these categories (none = all)', 'my-animated-block' ) }
						value={ categoryIds.map( String ) }
						options={ categories.map( ( category ) => ( {
							value: String( category.id ),
							label: category.name,
						} ) ) }
						onChange={ ( values: string[] ) =>
							setAttributes( {
								categoryIds: values
									.map( ( value ) => Number.parseInt( value, 10 ) )
									.filter( ( value ) => Number.isFinite( value ) ),
							} )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Display', 'my-animated-block' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Category filter buttons', 'my-animated-block' ) }
						checked={ showFilters }
						onChange={ ( value: boolean ) => setAttributes( { showFilters: value } ) }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Featured image', 'my-animated-block' ) }
						checked={ showImage }
						onChange={ ( value: boolean ) => setAttributes( { showImage: value } ) }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Date', 'my-animated-block' ) }
						checked={ showDate }
						onChange={ ( value: boolean ) => setAttributes( { showDate: value } ) }
					/>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Excerpt', 'my-animated-block' ) }
						checked={ showExcerpt }
						onChange={ ( value: boolean ) => setAttributes( { showExcerpt: value } ) }
					/>
					{ showExcerpt ? (
						<RangeControl
							__next40pxDefaultSize
							label={ __( 'Excerpt length (words)', 'my-animated-block' ) }
							value={ excerptLength }
							min={ 5 }
							max={ 60 }
							onChange={ ( value?: number ) =>
								setAttributes( { excerptLength: value ?? 20 } )
							}
						/>
					) : null }
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<ServerSideRender
					block="my-animated-block/post-grid"
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
