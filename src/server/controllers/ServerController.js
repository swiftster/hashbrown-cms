'use strict';

let ApiController = require('./ApiController');

class ServerController extends ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/api/server/projects', this.middleware({ setProject: false }), this.getAllProjects);
        app.get('/api/server/projects/:project', this.middleware({ setProject: false }), this.getProject);
        app.get('/api/server/:project/environments', this.middleware({ setProject: false }), this.getAllEnvironments);
    }
    
    /**
     * Gets a list of all projects
     */
    static getAllProjects(req, res) {
        ProjectHelper.getAllProjects()
        .then((projects) => {
            res.send(projects);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
    
    /**
     * Gets a project
     */
    static getProject(req, res) {
        ProjectHelper.getProject(req.params.project)
        .then((project) => {
            res.send(project);
        })
        .catch((e) => {
            res.status(502).send(e.message);
        });
    }
    
    /**
     * Gets a list of all environments
     */
    static getAllEnvironments(req, res) {
        let project = req.params.project;

        ProjectHelper.getAllEnvironments(project)
        .then((environments) => {
            res.send(environments);
        })
        .catch((e) => {
            res.status(502).send(e);
        });
    }
}

module.exports = ServerController;