import { InnerBlocks } from '@wordpress/block-editor';

/**
 * The wrapper and the FAQPage JSON-LD are rendered by render.php, so only
 * the inner blocks are stored in post_content.
 */
export default function save() {
	return <InnerBlocks.Content />;
}
