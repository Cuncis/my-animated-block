import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

export interface PickedMedia {
	id: number;
	url: string;
	alt: string;
	type: string;
}

interface Props {
	url: string;
	allowedTypes: string[];
	label: string;
	onSelect: ( media: PickedMedia ) => void;
	onRemove: () => void;
}

/**
 * Select / replace / remove button group around the core media library.
 * Shared by every block that needs an image or video.
 */
export default function MediaPicker( {
	url,
	allowedTypes,
	label,
	onSelect,
	onRemove,
}: Props ) {
	return (
		<MediaUploadCheck>
			<MediaUpload
				allowedTypes={ allowedTypes }
				onSelect={ ( media: Record< string, unknown > ) =>
					onSelect( {
						id: Number( media.id ),
						url: String( media.url ?? '' ),
						alt: String( media.alt ?? '' ),
						type: String( media.type ?? '' ),
					} )
				}
				render={ ( { open }: { open: () => void } ) => (
					<div className="mab-media-picker">
						<Button
							__next40pxDefaultSize
							variant="secondary"
							onClick={ open }
						>
							{ url
								? __( 'Replace', 'my-animated-block' )
								: label }
						</Button>
						{ url ? (
							<Button
								__next40pxDefaultSize
								variant="link"
								isDestructive
								onClick={ onRemove }
							>
								{ __( 'Remove', 'my-animated-block' ) }
							</Button>
						) : null }
					</div>
				) }
			/>
		</MediaUploadCheck>
	);
}
