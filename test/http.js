var u = require('url');
var http = require('http').createServer(function(req,res){
	var d = '';
	var path = require('url').parse(req.url).pathname;
	console.log('----------------http : %s from %s',req.method,req.url,path);
	res.writeHead(200, {'Content-Type': 'text/plain'});
	if(req.method == 'GET'){
		switch(path){
			case '/':
				res.end('succeed get "/"');
				break;
			case '/test':
				res.end('succeed get "/test"');
				break;
			default:
				res.end('not path');
		}
	}
	if(req.method == 'POST'){

	}
	req.on('data',function(chunk){
		d += chunk;
	});
	req.on('end',function(){
		res.end('data from'+req.url+':'+d);
	});
}).listen(80);
