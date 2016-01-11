/* global before, after */

var path = require('path'),
  skeletonAppPath = path.join(__dirname, 'app-skeleton'),
  Sails = require('sails'),
  responders = require('../../index.js'),
  sails;

before(function (done) {
  Sails.load({
    environment: 'test',
    appPath: skeletonAppPath,
    hooks: {
      grunt: false,
      rewire: rewire
    },
    loadHooks: [
      'moduleloader',
      'controllers',
      'services',
      'userconfig',
      'rewire'
    ],
    log: {
      level: 'silent'
    }
  },
  function (err, server) {
    console.log(server);
    if (err) { return done(err); }
    sails = server;
    return done(null, sails);
  });
});

after(function (done) {
  if (sails) { return sails.lower(done); }
  return done();
});
