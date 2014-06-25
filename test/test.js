var $ = require('../index.js');
$.server('./test/http.js',80);
$('/').get(function(data){
	console.log(data);
});
$('/').post('test post',function(data){
	console.log(data);
});
$('/test').setSearch('?name=nidad').set('a','b').get(function(data){
	console.log(data);
});