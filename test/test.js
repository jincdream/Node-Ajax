var $ = require('../index.js');
/*在子进程开启 http 服务器*/
$.server('./test/http.js',80);
/*模拟发送请求*/
$('/').get(function(data){
	console.log(data);
});
$('/').post('test post',function(data){
	console.log(data);
});
$('/test').setSearch('?name=nidad').set('a','b').get(function(data){
	console.log(data);
});
