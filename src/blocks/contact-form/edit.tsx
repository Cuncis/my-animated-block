import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import type { BlockEditProps } from '@wordpress/blocks';
import type { ContactFormAttributes } from './types';

function makeId(): string {
	const bytes = new Uint8Array( 6 );
	window.crypto.getRandomValues( bytes );
	return Array.from( bytes, ( b ) => b.toString( 16 ).padStart( 2, '0' ) ).join(
		''
	);
}

export default function Edit( {
	attributes,
	setAttributes,
}: BlockEditProps< ContactFormAttributes > ) {
	const { formId, recipient, subject, showPhone, buttonText, successMessage } =
		attributes;

	// A stable id lets the server find this block's settings on submit.
	useEffect( () => {
		if ( ! formId ) {
			setAttributes( { formId: makeId() } );
		}
	}, [ formId, setAttributes ] );

	const blockProps = useBlockProps( { className: 'mab-form' } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Delivery', 'my-animated-block' ) }>
					<TextControl
						__next40pxDefaultSize
						type="email"
						label={ __( 'Send messages to', 'my-animated-block' ) }
						help={ __(
							'Leave empty to use the site administrator email.',
							'my-animated-block'
						) }
						value={ recipient }
						onChange={ ( value: string ) => setAttributes( { recipient: value } ) }
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Email subject', 'my-animated-block' ) }
						value={ subject }
						onChange={ ( value: string ) => setAttributes( { subject: value } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Form', 'my-animated-block' ) }>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Include phone field', 'my-animated-block' ) }
						checked={ showPhone }
						onChange={ ( value: boolean ) => setAttributes( { showPhone: value } ) }
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Button text', 'my-animated-block' ) }
						value={ buttonText }
						onChange={ ( value: string ) => setAttributes( { buttonText: value } ) }
					/>
					<TextControl
						__next40pxDefaultSize
						label={ __( 'Success message', 'my-animated-block' ) }
						value={ successMessage }
						onChange={ ( value: string ) =>
							setAttributes( { successMessage: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="mab-form__field">
					<label>{ __( 'Name', 'my-animated-block' ) }</label>
					<input type="text" disabled />
				</div>
				<div className="mab-form__field">
					<label>{ __( 'Email', 'my-animated-block' ) }</label>
					<input type="email" disabled />
				</div>
				{ showPhone ? (
					<div className="mab-form__field">
						<label>{ __( 'Phone', 'my-animated-block' ) }</label>
						<input type="tel" disabled />
					</div>
				) : null }
				<div className="mab-form__field">
					<label>{ __( 'Message', 'my-animated-block' ) }</label>
					<textarea rows={ 4 } disabled />
				</div>
				<button type="button" className="mab-form__submit" disabled>
					{ buttonText }
				</button>
			</div>
		</>
	);
}
