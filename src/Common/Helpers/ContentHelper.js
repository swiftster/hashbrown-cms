'use strict';

/**
 * A helper class for Content
 *
 * @memberof HashBrown.Common.Helpers
 */
class ContentHelper {
    /**
     * Gets all Content objects
     *
     * @param {String} project
     * @param {String} environment
     *
     * @return {Promise} promise
     */
    static getAllContents(project, environment) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);

        return Promise.resolve();
    }

    /**
     * Gets a URL-friendly version of a string
     *
     * @param {String} string
     *
     * @param {String} slug
     */
    static getSlug(string) {
        return (string || '')
            .toLowerCase()
            .replace(/[æ|ä]/g, 'ae')
            .replace(/[ø|ö]/g, 'oe')
            .replace(/å/g, 'aa')
            .replace(/ü/g, 'ue')
            .replace(/ß/g, 'ss')
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
            ;
    }

    /**
     * Gets a Content object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     *
     * @return {Promise} promise
     */
    static getContentById(project, environment, id) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);

        return Promise.resolve();
    }
    
    /**
     * Sets a Content object by id
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} id
     * @param {Content} content
     *
     * @return {Promise} promise
     */
    static setContentById(project, environment, id, content) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(id, 'id', String);
        checkParam(content, 'content', HashBrown.Models.Content);

        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    /**
     * Checks if a Schema type is allowed as a child of a Content object
     *
     * @param {String} project
     * @param {String} environment
     * @param {String} parentId
     * @param {String} childSchemaId
     *
     * @returns {Promise} Is the Content node allowed as a child
     */
    static isSchemaAllowedAsChild(project, environment, parentId, childSchemaId) {
        checkParam(project, 'project', String);
        checkParam(environment, 'environment', String);
        checkParam(parentId, 'parentId', String);
        checkParam(childSchemaId, 'childSchemaId', String);

        // No parent ID means root, and all Schemas are allowed there
        if(!parentId) {
            return Promise.resolve();

        } else {
            return this.getContentById(project, environment, parentId)
            .then((parentContent) => {
                return HashBrown.Helpers.SchemaHelper.getSchemaById(project, environment, parentContent.schemaId);
            })
            .then((parentSchema) => {
                // The Schema was not an allowed child
                if(parentSchema.allowedChildSchemas.indexOf(childSchemaId) < 0) {
                    return HashBrown.Helpers.SchemaHelper.getSchemaById(project, environment, childSchemaId)
                    .then((childSchema) => {
                        return Promise.reject(new Error('Content with Schema "' + childSchema.name + '" is not an allowed child of Content with Schema "' + parentSchema.name + '"'));
                    });
                
                // The Schema was an allowed child, resolve
                } else {
                    return Promise.resolve();

                }
            });
        }
    }

    /**
     * Creates a new content object
     *
     * @return {Promise} promise
     */
    static createContent() {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    
    /**
     * Removes a content object
     *
     * @param {Number} id
     *
     * @return {Promise} promise
     */
    static removeContentById(id) {
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
}

module.exports = ContentHelper;
