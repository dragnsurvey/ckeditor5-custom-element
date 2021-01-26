import Plugin 				from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView 			from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { toWidget, toWidgetEditable } 				from '@ckeditor/ckeditor5-widget/src/utils';
import {CustomElemCommand}  from './customelem_command';
import defaultIcon 			from '../theme/icons/default.svg';


export default class CustomElemUI extends Plugin {


	init() {
		const editor 		= this.editor;
		const items      	= editor.config.get(( 'CustomElement.items' ))


		for (let i=0; i<items.length; i++){
			const tag  		= items[i].tag;
			const text 		= this._safeGet(items[i].placeholder, tag);
			const attr 		= this._safeGet(items[i].attributes, {});
			const inline	= this._safeGet(items[i].inline, true);
			const editable	= this._safeGet(items[i].editable, false);

			const attrkeys = Object.keys(attr);

			//schema
			if (inline){
				editor.model.schema.register(tag, {
					allowWhere: '$text',
					allowAttributes: attrkeys,
					isObject: true,
				});
			}
			else{
				editor.model.schema.register(tag, {
					allowIn: '$root',
					allowAttributes: attrkeys,
					isObject: true,
				});
			}


			editor.model.schema.extend( '$text', {
				allowIn: tag
			} );


			//---conversion
			editor.conversion.for( 'editingDowncast' ).elementToElement(
				 {
						model: tag,
						 view: ( modelItem, { writer: viewWriter } ) => {
							 const widgetElement = createPlaceholderView( modelItem, viewWriter, tag, attr.placeholder );

							 // Enable widget handling on a placeholder element inside the editing view.
							 return toWidget( widgetElement, viewWriter );
						 }
					}
			);
			editor.conversion.for( 'dataDowncast' ).elementToElement(
				( {
					model: tag,
					view: ( modelItem, { writer: viewWriter } ) => createPlaceholderView( modelItem, viewWriter, tag, attr.placeholder )
				} )
			);
			editor.conversion.for( 'upcast' ).elementToElement(
				( {
					view: tag,
					model: tag
				} )
			);
			//attribute conversion
			for (let a=0; a<attrkeys.length; a++){
				editor.conversion.for( 'downcast' ).attributeToAttribute( ( {
					model: attrkeys[a],
					view: attrkeys[a],
					converterPriority: 'low'
				} ) );
				editor.conversion.for( 'upcast' ). attributeToAttribute( {
					view: attrkeys[a],
					model: attrkeys[a],
					converterPriority: 'low'
				} );
			}


			//---command
			const com =  'custom-element-'+tag;
			editor.commands.add( com, new CustomElemCommand( editor, tag, text, inline, attr  ) );

		}

		// Helper method for both downcast converters.
		function createPlaceholderView( modelItem, viewWriter, tag, placeholder ) {

			const placeholderView = viewWriter.createContainerElement( tag );

			// Insert the placeholder name (as a text).
			const innerText = viewWriter.createText( '@'+placeholder );
			viewWriter.insert( viewWriter.createPositionAt( placeholderView, 0 ), innerText );

			return placeholderView;
		}
	}



	_safeGet(input, safeDefault){
		if( typeof input !== 'undefined' &&  (input || input===false || input===0) ){
			return input;
		}
		else{
			return safeDefault;
		}
	}
}

