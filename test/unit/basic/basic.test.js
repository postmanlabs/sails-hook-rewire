/**
 * Basic tests to check whether sails has successfully loaded, and that the required modules have been rewired
 */

var expect = require('expect.js');

/* global describe, it, sails, FetchService, FileService */
describe('Basic hook test', function () {
  it('rewire hook loads successfully', function () {
    expect(sails.hooks.rewire).to.be.ok();
  });

  describe('modules have been reqired as expected', function () {
    it('File controller has been rewired', function () {
      expect(sails.controllers.file.hasOwnProperty('__set__')).to.be.ok();
    });

    it('DNSLookUp controller has been rewired, and is not in global', function () {
      expect(sails.controllers.dnslookup.hasOwnProperty('__set__')).to.be.ok();
      expect(global.hasOwnProperty('DNSLookUp')).to.not.be.ok();
    });

    it('User controller has not been rewired', function () {
      expect(sails.controllers.user.hasOwnProperty('__set__')).to.not.be.ok();
    });

    it('Fetch service has been rewired, and is in global', function () {
      expect(sails.services.fetchservice.hasOwnProperty('__set__')).to.be.ok();
      expect(global.hasOwnProperty('FetchService')).to.be.ok();
      expect(FetchService.hasOwnProperty('__set__')).to.be.ok();
    });

    it('Request service has not been rewired', function () {
      expect(sails.services.requestservice.hasOwnProperty('__set__')).to.not.be.ok();
    });

    it('File service has been rewired, but not the global object', function () {
      expect(sails.services.fileservice.hasOwnProperty('__set__')).to.be.ok();
      expect(global.hasOwnProperty('FileService')).to.be.ok();
      expect(FileService.hasOwnProperty('__set__')).to.not.be.ok();
    });
  });
});
