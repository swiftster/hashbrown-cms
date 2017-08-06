'use strict';

const RequestHelper = require('Client/Helpers/RequestHelper');

const NavbarPane = require('./NavbarPane');
const NavbarMain = require('./NavbarMain');

/**
 * The Template navbar pane
 * 
 * @memberof HashBrown.Client.Views.Navigation
 */
class TemplatePane extends NavbarPane {
    /**
     * Event: Click add Template
     */
    static onClickAddTemplate() {
        let newTemplate = new Template({type: 'page'});

        UI.confirmModal(
            'add',
            'Add new template',
            [
                _.div({class: 'input-group'}, 
                    _.span('Type'),
                    _.div({class: 'input-group-addon'}, 
                        _.select({class: 'form-control'},
                            _.each(['page', 'partial'], (i, type) => {
                                return _.option({value: type}, type);
                            })
                        )
                        .val(newTemplate.type)
                        .on('change', (e) => {
                            newTemplate.type = e.target.value;
                        })
                    )
                ),
                _.div({class: 'input-group'}, 
                    _.span('Name'),
                    _.div({class: 'input-group-addon'}, 
                        _.input({class: 'form-control', type: 'text', placeholder: 'Template name'})
                        .on('change keyup paste propertychange', (e) => {
                            newTemplate.name = e.target.value;
                        })
                    )
                )
            ],
            () => {
                newTemplate.updateId();

                // Sanity check
                if(!newTemplate.type || !newTemplate.name || newTemplate.name.length < 2) { return false; }

                // Look for duplicate id
                for(let template of resources.templates) {
                    if(template.id == newTemplate.id && template.type == newTemplate.type) {
                        UI.errorModal(new Error('A Template of type "' + template.type + '" and id "' + template.id + '" already exists'));
                        return;
                    }
                }

                RequestHelper.request('post', 'templates/' + newTemplate.type + '/' + newTemplate.id, newTemplate)
                .then(() => {
                    return RequestHelper.reloadResource('templates');
                })
                .then(() => {
                    NavbarMain.reload();

                    location.hash = '/templates/' + newTemplate.type + '/' + newTemplate.id;
                })
                .catch(UI.errorModal);
            }
        );
    }
        
    /**
     * Event: On click remove Template
     */
    static onClickRemoveTemplate() {
        let $element = $('.cr-context-menu__target-element'); 
        let id = $element.data('id');
        let type = $element.attr('href').replace('#/templates/', '').replace('/' + id, '');
        
        let model;

        for(let template of resources.templates) {
            if(template.id == id && template.type == type) {
                model = template;
            }
        }

        if(!model) {
            UI.errorModal(new Error('Template of id "' + id + '" and type "' + type + '" was not found'));
            return;
        }
        
        UI.confirmModal('delete', 'Delete "' + model.name + '"', 'Are you sure you want to delete this template?', () => {
            RequestHelper.request('delete', 'templates/' + model.type + '/' + model.id)
            .then(() => {
                $element.parent().remove();

                return RequestHelper.reloadResource('templates');
            })
            .then(() => {
                NavbarMain.reload();
                
                // Cancel the TemplateEditor view if it was displaying the deleted Template
                if(location.hash == '#/templates/' + model.type + '/' + model.id) {
                    location.hash = '/templates/';
                }
            })
            .catch(UI.errorModal);
        });
    }

    /**
     * Event: On click rename Template
     */
    static onClickRenameTemplate() {
        let id = $('.cr-context-menu__target-element').data('id');
        let type = $('.cr-context-menu__target-element').attr('href').replace('#/templates/', '').replace('/' + id, '');
        let templateEditor = ViewHelper.get('TemplateEditor');
        let model;

        for(let template of resources.templates) {
            if(template.id == id && template.type == type) {
                model = template;
            }
        }

        if(!model) {
            UI.errorModal(new Error('Template of id "' + id + '" and type "' + type + '" was not found'));
            return;
        }

        UI.confirmModal(
            'rename',
            'Rename "' + model.name + '"',
            _.input({class: 'form-control', type: 'text', value: model.name, placeholder: 'Enter Template name'})
            .on('keyup paste change propertychange', (e) => {
                let oldName = model.name;

                model.name = e.target.value;
            }),
            () => {
                RequestHelper.request('post', 'templates/' + type + '/' + id, model)
                .then((newTemplate) => {
                    return RequestHelper.reloadResource('templates');
                })
                .then(() => {
                    NavbarMain.reload();

                    // Go to new Template if TemplateEditor was showing the old one
                    if(templateEditor && templateEditor.model.id == model.id) {
                        model.updateId();
                       
                        if(model.id == templateEditor.model.id) {
                            templateEditor.model = null;
                            templateEditor.fetch();
                        
                        } else { 
                            location.hash = '/templates/' + model.type + '/' + model.id;

                        }
                    }
                })
                .catch(UI.errorModal);
            }
        )
    }

    /**
     * Init
     */
    static init() {
        NavbarMain.addTabPane('/templates/', 'Templates', 'code', {
            getItems: () => { return resources.templates; },

            // Item path
            itemPath: function(item) {
                return item.type + '/' + item.id;
            },

            // Hierarchy logic
            hierarchy: function(item, queueItem) {
                queueItem.$element.attr('data-template-id', item.id);
                queueItem.$element.attr('data-remote', true);
               
                let rootDirName = item.type.substring(0, 1).toUpperCase() + item.type.substring(1) + 's';
                let parentDirName = item.parentId;

                if(!item.parentId) {
                    queueItem.createDir = true;

                    parentDirName = item.folder ? rootDirName + '/' + item.folder : rootDirName;
                }

                queueItem.parentDirAttr = {'data-template-id': parentDirName };
                queueItem.parentDirExtraAttr = { 'data-remote': true };
            },

            // Item context menu
            itemContextMenu: {
                'This template': '---',
                'Copy id': () => { this.onClickCopyItemId(); },
                'Rename': () => { this.onClickRenameTemplate(); },
                'Remove': () => { this.onClickRemoveTemplate(); }
            },

            // General context menu
            paneContextMenu: {
                'Template': '---',
                'Add template': () => { this.onClickAddTemplate(); }
            }
        });
    }
}

module.exports = TemplatePane;
