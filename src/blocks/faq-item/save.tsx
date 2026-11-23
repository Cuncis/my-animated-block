import { RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { FaqItemAttributes } from './types';

/**
 * Native <details>: accessible, works without JavaScript.
 * question/answer are stored in the block comment (no `source`) so the
 * parent's render.php can read them for the FAQPage structured data.
 */
export default function save( {
	attributes,
}: BlockSaveProps< FaqItemAttributes > ) {
	const { question, answer, open } = attributes;
	const blockProps = useBlockProps.save( { className: 'mab-faq__item' } );

	return (
		<details { ...blockProps } open={ open }>
			<summary className="mab-faq__question">
				<RichText.Content tagName="span" value={ question } />
			</summary>
			<div className="mab-faq__answer">
				<RichText.Content tagName="p" value={ answer } />
			</div>
		</details>
	);
}
