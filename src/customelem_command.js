import Command 				from '@ckeditor/ckeditor5-core/src/command';
//import { findOptimalInsertionPosition} from '@ckeditor/ckeditor5-widget/src/utils';



export class CustomElemCommand extends Command {

    constructor( editor, tagName, placeholder, inline, attributes ) {
        super( editor );

        this.tagName     = tagName;
        this.placeholder = placeholder;
        this.attributes  = attributes;
        this.inline      = inline;
    };


	execute( options = {attributes : {name :"calculator"}, placeholder: "@calculator"} ) {
        const model = this.editor.model;

		model.change( writer => {

            const elem = writer.createElement( this.tagName, options.attributes );
            // const insertAtSelection = this.inline? model.document.selection.getFirstPosition()
            //                                      : findOptimalInsertionPosition( model.document.selection, model );
            writer.appendText(options.placeholder, elem);
            this.editor.model.insertContent( elem );


            writer.setSelection( elem, 'on' );

        });
    };
}





