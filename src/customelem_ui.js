import Plugin 				from '@ckeditor/ckeditor5-core/src/plugin';
import { toWidget, viewToModelPositionOutsideModelElement } 				from '@ckeditor/ckeditor5-widget/src/utils';
import {CustomElemCommand}  from './customelem_command';


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
					allowAttributes: ['name', 'answer_id'],
					isObject: true,
					isInline: true,
				});
			}
			else{
				editor.model.schema.register(tag, {
					allowIn: '$root',
					allowAttributes: ['name', 'answer_id'],
					isObject: true,
				});
			}


			editor.model.schema.extend( '$text', {
				allowIn: tag
			} );


			//---conversion
			editor.conversion.for( 'editingDowncast' ).elementToElement(
				( {
					model: tag,
					view: ( modelItem, conversionApi ) => {
						const  viewWriter  = conversionApi.writer;
						const widgetElement = viewWriter.createContainerElement( tag, attr );
						return toWidget( widgetElement, viewWriter );
					}
				} )
			);
			editor.conversion.for( 'dataDowncast' ).elementToElement(
				( {
					model: tag,
					view: tag
				} )
			);
			editor.conversion.for( 'upcast' ).elementToElement(
				( {
					model: tag,
					view: tag
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

			//out of bound management
			editor.editing.mapper.on(
				'viewToModelPosition',
				viewToModelPositionOutsideModelElement( editor.model, viewElement => viewElement.is( 'dns-element' ) )
			);
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

