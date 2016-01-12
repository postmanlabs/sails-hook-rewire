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
      global: true    // this does nothing as only models and services are injected into the global object by sails
    }
  ]
};
