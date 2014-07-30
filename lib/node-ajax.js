/*判断环境Node or Window*/
var isNode = typeof window === 'undefined';
/*以Url地址为入口,会缓存,所以后续操作都会运用到该地址,如果不改变的话.*/
function $(url){
  go._setUrl(url);
  go.header = {};
  return go;
}
/*Node出口*/
isNode?(exports = module.exports = $):void(0);

/*主函数*/
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

/*
*设置头部
*@param {object} or {string}-keyName
*@param {string} [keyval]
*/
go.set = function(keyName,keyval){
  if(!keyval){
    this.header = keyName;
  }else{
    this.header[keyName] = keyval;
  }
  return this;
};
/*
*设置Url
*@param {string} url
*/
go._setUrl = function(url){
  this.url = url;
  this._parseUrl(url);
  return this;
};
/*
*设置参数 ?key=val or key=val
*@param {string} search
*/
go.setSearch = function(search){
  this.search = search;
  this._setSearch(search);
  return this;
};
/*
*解析search
*/
go._setSearch = function(search){
  var self = this;
  var url = self.url;
  if(search[0] == '?') self.url = url + search;
  else
    self.url = url +'?'+ search;
  this._parseUrl(self.url);
};
/*
*解析Url
*/
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
/*
*设置post请求
*@param {function} callback
*@param {string} data
*/
go.post = function(data,callback){
  var self = this;
  self.header["Content-type"] = "application/x-www-form-urlencoded";
  self.method = 'POST';
  self.submit(callback,data);
};
/*
*设置get请求
*@param {function} callback
*@param {string} search
*/
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
/*
*客户端 发送请求 submit
*@param {function} callback
*@param {string} data
*/
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
/*
*Node.js 发送请求 submit
*@param {function} callback
*@param {string} data
*/
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
/*submit函数*/
go.submit = isNode?nSub:fSub;
