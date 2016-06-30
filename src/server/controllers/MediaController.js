'use strict';

let Controller = require('./Controller');

class MediaController extends Controller {
    /**
     * Initiates this controller
     */
    static init(app) {
        app.get('/media/:project/:environment/:id', MediaController.getMedia);
    }

    /**
     * Gets a Media object by id
     */
    static getMedia(req, res) {
        let id = req.params.id;

        ConnectionHelper.getMediaProvider()
        .then((connection) => {
            connection.getMedia(id)
            .then((media) => {
                if(media) {
                    res.redirect(media.url);
                } else {
                    res.sendStatus(404);
                }
            });
        });
    }
}

module.exports = MediaController;
