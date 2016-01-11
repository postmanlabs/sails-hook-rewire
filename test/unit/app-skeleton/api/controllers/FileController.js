/**
 * FileController
 *
 * @description :: Controller to test sails-hook-rewire
 */

var fs = require('fs');

module.exports = {
  sendFile: function (req, res) {
    fs.stat(req.body.path, function (err, stats) {
      if (err) {
        return res.json(500, {
          error: 'Error fetching file stats'
        });
      }

      return res.json(200, stats);
    });
  }
};
