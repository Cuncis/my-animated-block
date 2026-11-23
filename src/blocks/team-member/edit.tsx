import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import MediaPicker from '../../shared/MediaPicker';
import type { TeamMemberAttributes } from './types';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< TeamMemberAttributes > ) {
	const { photoUrl, name, role, bio, linkUrl, linkLabel } = attributes;
	const blockProps = useBlockProps( { className: 'mab-member' } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Member', 'my-animated-block' ) }>
					<MediaPicker
						url={ photoUrl }
						allowedTypes={ [ 'image' ] }
						label={ __( 'Select photo', 'my-animated-block' ) }
						onSelect={ ( media ) =>
							setAttributes( { photoId: media.id, photoUrl: media.url } )
						}
						onRemove={ () =>
							setAttributes( { photoId: undefined, photoUrl: '' } )
						}
					/>
					<TextControl
						__next40pxDefaultSize
						type="url"
						label={ __( 'Link URL (LinkedIn, website…)', 'my-animated-block' ) }
						value={ linkUrl }
						onChange={ ( value: string ) => setAttributes( { linkUrl: value } ) }
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Link text', 'my-animated-block' ) }
						value={ linkLabel }
						onChange={ ( value: string ) => setAttributes( { linkLabel: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				{ photoUrl ? (
					<div className="mab-member__photo">
						<img src={ photoUrl } alt="" />
					</div>
				) : null }
				<RichText
					tagName="h3"
					className="mab-member__name"
					value={ name }
					onChange={ ( value: string ) => setAttributes( { name: value } ) }
					placeholder={ __( 'Name', 'my-animated-block' ) }
					allowedFormats={ [] }
				/>
				<RichText
					tagName="p"
					className="mab-member__role"
					value={ role }
					onChange={ ( value: string ) => setAttributes( { role: value } ) }
					placeholder={ __( 'Role', 'my-animated-block' ) }
					allowedFormats={ [] }
				/>
				<RichText
					tagName="p"
					className="mab-member__bio"
					value={ bio }
					onChange={ ( value: string ) => setAttributes( { bio: value } ) }
					placeholder={ __( 'Short bio…', 'my-animated-block' ) }
				/>
				{ linkUrl ? <span className="mab-member__link">{ linkLabel }</span> : null }
			</div>
		</>
	);
}
