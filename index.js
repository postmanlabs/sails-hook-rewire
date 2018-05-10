// jscs:disable disallowDanglingUnderscores
module.exports = function (sails) {
  var path = require('path'),
    rewire = require('rewire'),
    util = require('sails-util'),
    /**
     * Rewire hook definition
     * Conforms to http://sailsjs.org/documentation/concepts/extending-sails/hooks/hook-specification
     *
     * @type {Object}
     */
    rewirePolicyHookDef = {
      /**
       * Sets rewire defaults
       */
      defaults: {
        __configKey__: {
          environments: {
            test: true
          }
        }
      },
      /**
       * Initialize the hook.
       * Called when sails loads
       */
      initialize: function (cb) {
        // Make the callback optional
        cb = util.optional(cb);
        sails.log.info('Rewiring components for testing');
        var hookConfig = sails.config[this.configKey],
          env = sails.config.environment;
        if (hookConfig.environments && hookConfig.environments[env] !== true) {
          sails.log.verbose('Not rewiring as app is not running in an enabled environment');
          return cb();
        }

        sails.log.verbose('Rewiring components for testing');
        rewirePolicyHookDef.rewire();

        return cb();
      },

      /**
       * Load all modules listed to be rewired in config, via rewire, and replace them in sails.
       */
      rewire: function () {
        var hookConfig = sails.config[this.configKey];
        util.each(hookConfig, function (moduleConfig, moduleName) {
          if (!sails.hasOwnProperty(moduleName)) {
            sails.log.verbose(moduleName, ' not a part of sails, skipping');
            return;
          }

          util.each(moduleConfig, function (conf) {
            var modulePath = path.join(sails.config.paths[moduleName], conf.name + '.js'),
              rewired = rewire(modulePath),
              globalName = conf.name.replace(/Adapter|Controller/, '');

            // Bind the sails object to the module
            rewired.sails = sails;
            util.bindAll(rewired);

            // Replace the module in sails
            sails[moduleName][globalName.toLowerCase()] = rewired;

            // Replace the module in global, if it matches criteria to replace in globals
            conf.global && moduleName.match(/models|services/) && (global[globalName] = rewired);
          });
        });
      }
    };

  return rewirePolicyHookDef;
};
