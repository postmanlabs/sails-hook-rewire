/**
 * DNSLookUp
 *
 * @description :: Controller to test sails-hook-rewire
 */

var dns = require('dns');

module.exports = {
  performLookup: function (req, res) {
    dns.lookup(req.body.hostname, function (err, address, family) {
      if (err) {
        return res.json(500, {
          error: 'Error looking up DNS entry'
        });
      }

      return res.json(200, {
        address: address,
        family: family
      });
    });
  }
};
