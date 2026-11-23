import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { FaqItemAttributes } from './types';

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< FaqItemAttributes > ) {
	const { question, answer, open } = attributes;
	// A real <details> would swallow clicks while editing, so the editor
	// shows question and answer as plain, always-visible fields.
	const blockProps = useBlockProps( { className: 'mab-faq__item' } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Item', 'my-animated-block' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Open by default', 'my-animated-block' ) }
						checked={ open }
						onChange={ ( value: boolean ) => setAttributes( { open: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="mab-faq__question">
					<RichText
						tagName="span"
						value={ question }
						onChange={ ( value: string ) => setAttributes( { question: value } ) }
						placeholder={ __( 'Question', 'my-animated-block' ) }
						allowedFormats={ [] }
					/>
				</div>
				<div className="mab-faq__answer">
					<RichText
						tagName="p"
						value={ answer }
						onChange={ ( value: string ) => setAttributes( { answer: value } ) }
						placeholder={ __( 'Answer', 'my-animated-block' ) }
					/>
				</div>
			</div>
		</>
	);
}
