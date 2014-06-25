var isNode = typeof window === 'undefined';
function $(url){
  go._setUrl(url);
  go.header = {};
  return go;
}
isNode?(exports = module.exports = $):void(0);
var go = (function(){
  if(isNode){
    var http = require('http');
    http._get = http.get;
    return http;
  }else{
    var req = window.XMLHttpRequest;
    var ie = window.ActiveXObject;
    var requestF = ie? new ie('Microsoft.XMLHTTP'): new req;
    return requestF;
  }
})();
go.set = function(a,b){
  if(!b){
    this.header = a;
  }else{
    this.header[a] = b;
  }
  return this;
};
go._setUrl = function(url){
  this.url = url;
  this._parseUrl(url);
  return this;
};
go.setSearch = function(search){
  this.search = search;
  this._setSearch(search);
  return this;
};
go._setSearch = function(search){
  var self = this;
  var url = self.url;
  if(search[0] == '?') self.url = url + search;
  else
    self.url = url +'?'+ search;
  this._parseUrl(self.url);
};
go._parseUrl = function(url){
  if(url[0] == '/'){
    url = (isNode ?
          'localhost':
          window.location.host)+url;
  }else if(!isNode){
    var location = window.location.toString();
    url = location.substring(0,url.lastIndexOf('/')+1)+url;
  }

  console.log('request url @ :'+url);
};
go.post = function(data,callback){
  var self = this;
  self.header["Content-type"] = "application/x-www-form-urlencoded";
  self.method = 'POST';
  self.submit(callback,data);
};
go.get = function(search,callback){
  var self = this;
  if(typeof search == 'function'){
    callback = search;
  }else if(arguments.length == 2){
    self._setSearch(search);
    self.search = search;
  }
  self.header["Content-type"] = "text/plain";
  self.method = 'GET';
  self.submit(callback);
};
go.submit = isNode?nSub:fSub;
function fSub(callback,data){
  var self = this;
  self.onreadystatechange=function()
  {
  if (self.readyState==4 && self.status==200){
      callback(self.responseText);
    }else if(self.status>400){
      callback(undefined);
    }
  };
  self.open(self.method,this.url,true);
  for(var i in self.header){
    this.setRequestHeader(i,self.header[i]);
  }
  self.send(data);
}
function nSub(callback,data){
  var self = this;
  var opts = {
    host: self.location,
    method: self.method,
    path: self.url,
    port: process.env.PORT,
    headers: self.header
  };
  var req = self.request(opts,function(res){
    res.setEncoding('utf8');
    res.on('data',callback);
  });
  req.on('error',callback);
  if(data) req.write(data);
  req.end();
}