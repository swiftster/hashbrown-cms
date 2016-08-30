'use strict';

// Classes
let ApiController = require('./ApiController');
let Content = require('../models/Content');

/**
 * Controller for Content
 */
class ContentController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/:project/:environment/content', this.middleware(), this.getAllContents);
        app.get('/api/:project/:environment/content/:id', this.middleware(), this.getContent);
        app.post('/api/:project/:environment/content/new/:schemaId', this.middleware(), this.createContent);
        app.post('/api/:project/:environment/content/publish', this.middleware(), this.publishContent);
        app.post('/api/:project/:environment/content/unpublish', this.middleware(), this.unpublishContent);
        app.post('/api/:project/:environment/content/:id', this.middleware(), this.postContent);
        app.delete('/api/:project/:environment/content/:id', this.middleware(), this.deleteContent);
    }
    
    /**
     * Gets a list of all Content objects
     */
    static getAllContents(req, res) {
        ContentHelper.getAllContents()
        .then(function(nodes) {
            res.send(nodes);
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));
        });
    }

    /**
     * Gets a Content object by id
     *
     * @return {Object} Content
     */
    static getContent(req, res) {
        let id = req.params.id;
   
        if(id && id != 'undefined') {
            ContentHelper.getContentById(id)
            .then(function(node) {
                res.status(200).send(node);
            })
            .catch((e) => {
                res.status(502).send(ApiController.error(e));
            });
        
        } else {
            res.status(402).send('Content id is undefined');

        }
    }
    
    /**
     * Creates a new Content object
     *
     * @return {Content} content
     */
    static createContent(req, res) {
        let parentId = req.query.parent;
        let schemaId = req.params.schemaId;

        ContentHelper.createContent(schemaId, parentId)
        .then((node) => {
            res.status(200).send(node);
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));
        });
    }

    /**
     * Posts a Content object by id
     */
    static postContent(req, res) {
        let id = req.params.id;
        let node = req.body;
        
        ContentHelper.setContentById(id, node)
        .then(() => {
            res.status(200).send(node);
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));   
        });
    }
   
    /**
     * Publishes a Content node
     */
    static publishContent(req, res) {
        let content = new Content(req.body);

        ConnectionHelper.publishContent(content)
        .then(() => {
            res.status(200).send(req.body);
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));   
        });
    }
    
    /**
     * Unpublishes a Content node
     */
    static unpublishContent(req, res) {
        let content = new Content(req.body);

        ConnectionHelper.unpublishContent(content)
        .then(() => {
            res.status(200).send(content);
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));
        });
    }

    /**
     * Deletes a Content object by id
     */
    static deleteContent(req, res) {
        let id = req.params.id;
        let removeChildren = req.query.removeChildren == true || req.query.removeChildren == 'true';

        ContentHelper.removeContentById(id, removeChildren)
        .then(() => {
            res.status(200).send(id);
        })
        .catch((e) => {
            res.status(502).send(ApiController.error(e));
        });
    }
}

module.exports = ContentController;
