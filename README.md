# sails-hook-rewire

This is a installable [sailsjs](http://sailsjs.org/) hook that lets you rewire sails components, when sails is
lifted in `test` environment.

Often during testing you need to stub certain functions inside your sails models/controllers/services,
for example a function that makes http calls.

`sails-hook-rewire` uses the [`rewire`](https://github.com/jhnns/rewire) module to replace components already
loaded by sails, with their rewired versions.

## Installation

```bash
npm install sails-hook-rewire --save
```

## Usage

###### List components you want rewired, in `config/rewire.js`

```javascript
/**
 * Configuration to list which sails components to rewire.
 *
 * You can rewire models, polices, adapters, hooks, blueprints, and responses.
 * You can also choose to have models and services rewired in the global object. Sails only injects models and services
 * in the global obejct.
 *
 * @type {Object}
 */
module.exports.rewire = {
  // List services to be rewired
  services: [
    {
      name: 'FileService',
      global: true    // replace the global FileService with the rewired version
    },
    {
      name: 'FetchService',
      global: false   // don't replace the global FetchService with the rewired version
    }
  ],
  // List controllers to be rewired
  controllers: [
    {
      name: 'FileController'
    },
    {
      name: 'DNSLookUpController',
      global: true    // this does nothing as controllers are not injected into the global object by sails
    }
  ]
};
```

###### Rewire your components

Suppose you have a service, FileService, that depends on the `fs` module, and you want to stub `fs.readFile` method
in the service. Since the service has already been rewired, all you need to do is stub

```javascript
var expect = require('expect.js'),
  fileServiceRevert;

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
      expect(data).to.not.be.ok()

      return done();
    });
  });

  it('handles invalid json', function (done) {
    FileService.fetchJSONFromFile('/var/www/jsons/invalid.json', function (err, data) {
      expect(err).to.be.ok();
      expect(err.error instanceof Error).to.be.ok();
      expect(data).to.not.be.ok()

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
```

###### Run tests

When running tests, ensure that sails is lifted in the `test` environment. You can do this by either,

 - Setting `NODE_ENV` to `test` before the tests are run

```bash
export NODE_ENV=test;
npm test;
unset NODE_ENV;
```

 - Passing the environment to sails while loading in a test bootstrap.

```javascript
var Sails = require('sails'),
  sails;

before(function (done) {
  Sails.load({
    environment: 'test'
    // other setting overrides
  },
  function (err, server) {
    if (err) { return done(sails); }
    sails = server;
    return done(null, sails);
  });
});

after(function (done) {
  sails.lower(done);
});
```

Optionally, if you wish to lift your server in test mode, you can pass the environment as an option to `sails lift`

```bash
sails lift --environment=test
```

For more examples of how to test sails components with rewire, check out the
[tests](https://github.com/postmanlabs/sails-hook-rewire/tree/master/test/unit) for this module.

---
This project is licensed under the [Apache 2.0](LICENSE.md) License.

For contributing, please check the [contributing guidelines](CONTRIBUTING.md).

Made with :heart: by [Postman](https://getpostman.com)
