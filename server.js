'use strict';

var dolphin = require('dolphinio');

// Creates and serves mean application
dolphin.serve({ /*options placeholder*/ }, function(app, config) {
	var port = config.https && config.https.port ? config.https.port : config.http.port;
	console.log('Dolphin app started on port ' + port + ' (' + process.env.NODE_ENV + ')');
});

//test