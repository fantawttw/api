var xBrowserSync = xBrowserSync || {};
xBrowserSync.API = xBrowserSync.API || {};

/* ------------------------------------------------------------------------------------
 * Class name:  xBrowserSync.API.Info 
 * Description: Provides API service information.
 * ------------------------------------------------------------------------------------ */

xBrowserSync.API.Info = function() {
    'use strict';
    
    var global = require('./global.js');
    var config = require('./config.js');
    var db = require('./db.js');
    var bookmarks = require('./bookmarks.js');
    
    var getInfo = function(req, res, next) {
        var serviceInfo = {
            status: config.status,
            message: config.statusMessage,
            recaptcha: {
                enabled: config.recaptcha.enabled,
                siteKey: config.recaptcha.siteKey
            }
        };
        
        if (config.status === global.serviceStatuses.offline) {
            res.send(200, serviceInfo);
            return next();
        }
        
        // Check if accepting new syncs
        db.acceptingNewSyncs()
            .then(function(result) {
                serviceInfo.status = (!!result) ? 
                    global.serviceStatuses.online : global.serviceStatuses.noNewSyncs;
                
                res.send(200, serviceInfo);
                return next();
            });
    };
    
    return {
        getInfo: getInfo
    };
};

module.exports = xBrowserSync.API.Info();