/**
* FetchService
*
* @description :: Service to test sails-hook-rewire
*/

var http = require('http');

module.exports = {
  fetchJson: function (url, cb) {
    http.get(url, function (res) {
      var data = '';

      res.on('data', function (datum) {
        data += datum;
      });

      res.on('end', function () {
        var json = JSON.parse(data);
        return cb(null, json);
      });
    }).on('error', function (err) {
      return cb(err);
    });
  }
};
