var fs = require('fs');
var cp = function(path){
	var ajax = fs.createReadStream('./node-ajax.js',{encoding: 'utf-8'});
	var file = fs.createWriteStream(path,{encoding: 'utf-8'});
	ajax.pipe(file);
};
var readline = require('readline');
var ps = require('path');
var rl = readline.createInterface({
	input: process.stdin,
	output:process.stdout
});
console.log('will use path.join(__dirname,[input]) to create a *.js');
console.log('this path is %s \n\r',__dirname);
rl.on('line',function(line){
	var p = ps.join(__dirname,line);
	var ls = p[p.length-1];
	var name = '';
	if(ls == '\\') name = 'node-ajax.js';
	else if(ls != '\\' && ls!= 's') name = '.js';
	p = p+name;
	if(p == __dirname+name) throw new Error('it will delete node-ajax.js');
	console.log('%s in created\n\r',p);
	cp(p);
	rl.close();
});