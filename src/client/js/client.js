'use strict';

// Libraries
window.$ = window.jQuery = require('jquery');
require('bootstrap');
require('putaitu.js');
require('bootstrap-datepicker');
let jade = require('jade');

// Views
let NavbarMain = require('./views/NavbarMain');
let JSONEditor = require('./views/JSONEditor');
let PageEditor = require('./views/PageEditor');
let MediaViewer = require('./views/MediaViewer');

// -----------
// Ready functions
// -----------
let onReadyCallbacks = [];

function onReady(callback) {
    onReadyCallbacks.push(callback);
}

function checkReady() {
    if(resourcesLoaded >= resourcesRequired) {
        for(let i in onReadyCallbacks) {
            onReadyCallbacks[i]();
        }
    }
}

// -----------
// Preload resources
// -----------
let resourcesRequired = 5;
let resourcesLoaded = 0;

window.resources = {};

$.getJSON('/api/pages', function(pages) {
    window.resources.pages = pages;

    resourcesLoaded++;
    checkReady();
});

$.getJSON('/api/sections', function(sections) {
    window.resources.sections = sections;
    
    resourcesLoaded++;
    checkReady();
});

$.getJSON('/api/schemas', function(schemas) {
    window.resources.schemas = schemas;
    
    resourcesLoaded++;
    checkReady();
});

$.getJSON('/api/fieldViews', function(fieldViews) {
    for(let id in fieldViews) {
        fieldViews[id] = jade.compile(fieldViews[id]);
    }
    
    window.resources.fieldViews = fieldViews;
    
    resourcesLoaded++;
    checkReady();
});

$.getJSON('/api/media', function(media) {
    window.resources.media = media;
    
    resourcesLoaded++;
    checkReady();
});

// -----------
// Routes
// -----------
// Page edit
Router.route('/pages/:id', function() {
    let pageEditor = new PageEditor({
        modelUrl: '/api/pages/' + this.id
    });
   
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(pageEditor.$element);
});

// Page edit (JSON editor)
Router.route('/pages/json/:id', function() {
    let pageEditor = new JSONEditor({
        modelUrl: '/api/pages/' + this.id
    });
  
     
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(pageEditor.$element);
});

// Schema edit
Router.route('/schemas/:id', function() {
    let jsonEditor = new JSONEditor({
        modelUrl: '/api/schemas/' + this.id
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.id);
    
    $('.workspace').html(jsonEditor.$element);
});

// Media preview
Router.route('/media/:url', function() {
    let mediaViewer = new MediaViewer({
        mediaPath: '/media/' + this.url
    });
    
    ViewHelper.get('NavbarMain').highlightItem(this.url);
    
    $('.workspace').html(mediaViewer.$element);
});

// ----------
// Init
// ----------
onReady(function() {
    new NavbarMain();

    Router.init();
});