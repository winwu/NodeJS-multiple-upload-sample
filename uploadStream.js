'use strict';

var path = require('path');
var fs = require('fs');
var os = require('os');
var wrap = require('promisify-stream');

var stream = module.exports = {};

stream.multipleUpload = function *(part, targetPath) {
  var tmpRandomPath = path.join(os.tmpdir(), Math.random().toString());
  var stream = wrap(fs.createWriteStream(tmpRandomPath));
  part.pipe(stream.stream);
  tmpRandomPath = stream.stream['path'];

  console.log('UPLOADING %s -> %s', part.filename, tmpRandomPath);

  // TODO: how to write better?
  stream.end().then(function() {
    var stream = wrap(fs.createReadStream(tmpRandomPath).pipe(fs.createWriteStream(targetPath)));

    stream.end().then(function() {
        console.log('UPLOADED.');
    });
  });

};
