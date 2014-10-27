'use strict';
var koa = require('koa');
var views = require('co-views');
var router = require('koa-router');
var serve = require('koa-static');
var uploadStream = require('./uploadStream');
var path = require('path');
var uid = require('uid2');
var parse = require('co-busboy');
var path = require('path');
// init app
var app = module.exports = koa();
var render = views(__dirname + '/views', { ext: 'jade'});
app.use(serve(__dirname + '/public'));
app.use(router(app));

app.get('/', indexAction);
app.post('/', fileUploadAction);

function *indexAction() {
  this.body = yield render('upload');
};


function *fileUploadAction() {
  //console.log('hihihhi!');
  if (this.method !== 'POST') {
    return yield next;
  }

  var parts = parse(this);
  var part;

  while (part = yield parts) {
    var unique = uid(32);
    // get file type, ex: jpg, png... etc..
    var fileType = part.mime.split('/')[1];
    var newFileName = unique + '.' + fileType;
    var newFilePath = path.join(__dirname
          , 'public'
          ,  newFileName );

    yield uploadStream.multipleUpload(part ,newFilePath);
  };

  // TODO:
  // Do my own business login HERE, etc write newFilePathto Database...

  this.body = {
    message: 'check public folder'
  };

};

app.listen(8080);
console.log('Koa listen on 8080 :P');
