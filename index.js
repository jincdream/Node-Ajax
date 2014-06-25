module.exports = require('./lib/node-ajax.js');
module.exports.server = function(file,port){
	if(!port && !process.env.PORT)process.env.PORT = 3000;
	else process.env.PORT = port;
	var cp = require('child_process');
	var child = cp.fork(file);
};