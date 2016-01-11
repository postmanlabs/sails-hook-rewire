/**
 * Basic tests to check whether sails has successfully loaded, and that the required modules have been rewired
 */

var expect = require('expect.js'),
  util = require('sails-util');

/* global describe, it, sails */
describe('Basic hook test', function () {
  it('rewire hook loads successfully', function () {
    expect(sails.hooks.rewire).to.be.ok();
  });
});
