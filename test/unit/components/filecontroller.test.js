var expect = require('expect.js'),
  /**
   * Request stub. Sets path in the request body to either a valid file, or error file
   * based on the valid parameter
   *
   * @param  {Boolean} valid Whether to set the path to a valid file or not
   * @return {Object}        The stubbed request object
   */
  req = function (valid) {
    var path = valid && '/var/www/jsons/valid.json' || '/var/www/jsons/error.json';
    return {
      body: {
        path: path
      }
    };
  },
  /**
   * Stubbed response object
   *
   * @type {Object}
   */
  res = {
    /**
     * Stubbed res.json
     * Sets the status and data attributes to res to the passed values
     *
     * @param  {Number} status Status of the repsonse
     * @param  {Object} data   Data for the response
     */
    json: function (status, data) {
      this.status = status;
      this.data = data;
    }
  },
  fileControllerRevert;

/* global describe, it, before, after, beforeEach, sails */
describe('Tests for FileController', function () {
  before(function () {
    fileControllerRevert = sails.controllers.file.__set__({
      fs: {
        stat: function (path, callback) {
          var response = {
            err: null,
            stats: undefined
          };

          // Return an error if path matches error, eg /var/www/jsons/error.json
          path.match(/error/) && (response.err = new Error('Error reading file'));

          // Return an object if file matches valid, eg /var/www/jsons/valid.json
          path.match(/.+\/valid/) && (response.stats = {
            isStat: true
          });

          return callback(response.err, response.stats);
        }
      }
    });
  });

  after(function () {
    // Revert the rewiring
    fileControllerRevert();
  });

  beforeEach(function () {
    res.data = undefined;
    res.status = undefined;
  });

  it('returns a 200 with file stats', function () {
    sails.controllers.file.sendFileStats(req(true), res);
    expect(res.status).to.be(200);
    expect(res.data).to.be.an('object');
    expect(res.data.isStat).to.be.ok();
  });

  it('returns a 500 if there is an error fetching stats', function () {
    sails.controllers.file.sendFileStats(req(false), res);
    expect(res.status).to.be(500);
    expect(res.data).to.be.an('object');
    expect(res.data.error).to.be.ok();
  });
});
