module.exports = require('./lib/node-ajax.js');
/*在子进程开启 http 服务器*/
module.exports.server = function(file,port){
	if(!port && !process.env.PORT)process.env.PORT = 3000;
	else process.env.PORT = port;
	var cp = require('child_process');
	var child = cp.fork(file);
};
