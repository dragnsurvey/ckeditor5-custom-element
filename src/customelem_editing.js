import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class PlaceholderEditing extends Plugin {
    init() {
        console.log( 'PlaceholderEditing#init() got called' );
        const editor 		= this.editor;
        const items      	= editor.config.get(( 'CustomElement.items' ))
        this._defineSchema();                                                  // ADDED
    }

    _defineSchema() {                                                          // ADDED
        const schema = this.editor.model.schema;

        schema.register( 'placeholder', {
            // Allow wherever text is allowed:
            allowWhere: '$text',

            // The placeholder will act as an inline node:
            isInline: true,

            // The inline widget is self-contained so it cannot be split by the caret and can be selected:
            isObject: true,

            // The placeholder can have many types, like date, name, surname, etc:
            allowAttributes: [ 'name' ]
        } );
    }
}