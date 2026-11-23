import { RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { TeamMemberAttributes } from './types';

export default function save( { attributes }: BlockSaveProps< TeamMemberAttributes > ) {
	const { photoUrl, name, role, bio, linkUrl, linkLabel } = attributes;
	const blockProps = useBlockProps.save( { className: 'mab-member' } );

	return (
		<div { ...blockProps }>
			{ photoUrl ? (
				<div className="mab-member__photo">
					<img src={ photoUrl } alt="" loading="lazy" decoding="async" />
				</div>
			) : null }
			<RichText.Content tagName="h3" className="mab-member__name" value={ name } />
			<RichText.Content tagName="p" className="mab-member__role" value={ role } />
			<RichText.Content tagName="p" className="mab-member__bio" value={ bio } />
			{ linkUrl ? (
				<a className="mab-member__link" href={ linkUrl } rel="noopener">
					{ linkLabel }
				</a>
			) : null }
		</div>
	);
}
