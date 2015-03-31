'use strict';

var through = require('through2');
var CMD_REG = /define\(.*function\s*\(\s*require\s*(.*)?\)\s*\{/; // from seajs-wrap

var addWrapPlugin = function() {

  var stream = through.obj(function(file, encoding, callback) {

    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(null, file);
    }

    if (file.isBuffer()) {
      if (!CMD_REG.test(new Buffer(String(file.contents)))) {
        var output = 'define(function(require, exports, module) {\n' + String(file.contents) + '\n});';
        file.contents = new Buffer(output);
      }
      return callback(null, file);
    }

    callback(null, file);
  });

  return stream;
};

module.exports = addWrapPlugin;
