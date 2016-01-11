/**
* FileService
*
* @description :: Service to test sails-hook-rewire
*/

var fs = require('fs');

module.exports = {
  fetchJSONFromFile: function (path, cb) {
    fs.readFile(path, function (err, data) {
      if (err) {
        return cb({
          error: err,
          code: 'fileOpenError',
          message: 'Error opening file'
        });
      }

      var json;

      try {
        json = JSON.parse(data);
        return cb(null, json);
      }
      catch (e) {
        return cb({
          error: e,
          code: 'notJson',
          message: 'Passed file does not contain JSON data'
        });
      }
    });
  }
};
