/**
 * UserController
 *
 * @description :: Controller to test sails-hook-rewire
 */

var baseUser = {
  name: 'Arthur Dent',
  id: 1,
  occupation: 'Blundering Human',
  passtimes: [
    'drinking tea',
    'making sandwiches',
    'flying',
    'getting into trouble'
  ]
};

module.exports = {
  create: function (req, res) {
    var user = baseUser;

    return res.json(200, {
      user: user
    });
  },

  update: function (req, res) {
    var changes = req.body,
      user = baseUser;

    Object.keys(changes).forEach(function (prop) {
      user.hasOwnProperty(prop) && (user[prop] = changes[prop]);
    });

    return res.json(200, {
      user: user
    });
  },

  delete: function (req, res) {
    var user = baseUser;

    return res.json(200, {
      user: user
    });
  }
};
