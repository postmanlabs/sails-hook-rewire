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
      name: 'FetchService',
      global: true    // replace the global FetchService with the rewired version
    },
    {
      name: 'FileService',
      global: false   // don't replace the global FileService with the rewired version
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

###### Lift sails in the `test` environment

```bash
sails lift --environment=test
```

---
This project is licensed under the [Apache 2.0](LICENSE.md) License.

For contributing, please check the [contributing guidelines](CONTRIBUTING.md).

Made with :heart: by [Postman](https://getpostman.com)
