'use strict';

const Content = require('Client/Models/Content');

const FieldEditor = require('./FieldEditor');

/**
 * An editor for referring to other Content
 *
 * @description Example:
 * <pre>
 * {
 *     "myContentReference": {
 *         "label": "My content reference",
 *         "tabId": "content",
 *         "schemaId": "contentReference",
 *         "config": {
 *            "allowedSchemas": [ "page", "myCustomSchema" ]
 *         }
 *     }
 * }
 * </pre>
 *
 * @memberof HashBrown.Client.Views.Editors.FieldEditors
 */
class ContentReferenceEditor extends FieldEditor {
    constructor(params) {
        super(params);

        this.fetch();
    }

    /**
     * Event: Change value
     */
    onChange(newValue) {
        this.value = newValue;

        this.trigger('change', this.value);
    }

    /**
     * Gets a list of allowed Content options
     *
     * @returns {Array} List of options
     */
    getDropdownOptions() {
        let allowedContent = [];
        let areRulesDefined = this.config && Array.isArray(this.config.allowedSchemas) && this.config.allowedSchemas.length > 0;

        for(let content of resources.content) {
            if(areRulesDefined) {
                let isContentAllowed = this.config.allowedSchemas.indexOf(content.schemaId) > -1;
                
                if(!isContentAllowed) { continue; }
            }

            allowedContent[allowedContent.length] = {
                title: content.prop('title', window.language) || content.id,
                id: content.id
            };
        }

        return allowedContent;
    }

    /**
     * Renders the config editor
     *
     * @param {Object} config
     *
     * @returns {HTMLElement} Element
     */
    static renderConfigEditor(config) {
        config.allowedSchemas = config.allowedSchemas || [];
        
        return _.div({class: 'editor__field'},
            _.div({class: 'editor__field__key'}, 'Allowed Schemas'),
            _.div({class: 'editor__field__value'},
                new HashBrown.Views.Widgets.Dropdown({
                    options: HashBrown.Helpers.SchemaHelper.getAllSchemasSync('content'),
                    useMultiple: true,
                    value: config.allowedSchemas,
                    useClearButton: true,
                    valueKey: 'id',
                    labelKey: 'name',
                    onChange: (newValue) => {
                        config.allowedSchemas = newValue;
                    }
                }).$element
            )
        );
    }

    /**
     * Render this editor
     */
    template() {
        return _.div({class: 'editor__field__value'}, [
            new HashBrown.Views.Widgets.Dropdown({
                value: this.value,
                options: this.getDropdownOptions(),
                useTypeAhead: true,
                valueKey: 'id',
                useClearButton: true,
                tooltip: this.description || '',
                labelKey: 'title',
                onChange: (newValue) => {
                    this.value = newValue;

                    this.trigger('change', this.value);
                }
            }).$element
        ]);
    }
}

module.exports = ContentReferenceEditor;
