var expect = require('expect.js'),
  fileServiceRevert;

/* global describe, it, before, after, FileService */
describe('Tests for FileService', function () {
  before(function () {
    fileServiceRevert = FileService.__set__({
      fs: {
        readFile: function (filename, options, callback) {
          var response = {
            err: null,
            data: undefined
          };

          callback = typeof options === 'function' && options || callback || function () {};

          // Return an error if filename matches error, eg /var/www/jsons/error.json
          filename.match(/error/) && (response.err = new Error('Error reading file'));

          // Return a valid JSON string if file matches valid, eg /var/www/jsons/valid.json
          filename.match(/.+\/valid/) && (response.data = '{"valid": true}');

          // Return an invalid JSON string if file matches invalid, eg /var/ww/jsons/invalid.json
          filename.match(/.+\/invalid/) && (response.data = '{"invalid": true;');

          return callback(response.err, response.data);
        }
      }
    });
  });

  after(function () {
    // Revert the rewiring
    fileServiceRevert();
  });

  it('handles read error', function (done) {
    FileService.fetchJSONFromFile('/var/www/jsons/error.json', function (err, data) {
      expect(err).to.be.ok();
      expect(err.error instanceof Error).to.be.ok();
      expect(data).to.not.be.ok();

      return done();
    });
  });

  it('handles invalid json', function (done) {
    FileService.fetchJSONFromFile('/var/www/jsons/invalid.json', function (err, data) {
      expect(err).to.be.ok();
      expect(err.error instanceof Error).to.be.ok();
      expect(data).to.not.be.ok();

      return done();
    });
  });

  it('returns a json if file has valid json', function (done) {
    FileService.fetchJSONFromFile('/var/www/jsons/valid.json', function (err, data) {
      expect(err).to.not.be.ok();
      expect(data).to.be.ok();
      expect(data).to.be.an('object');
      expect(data.valid).to.be.ok();

      return done();
    });
  });
});
