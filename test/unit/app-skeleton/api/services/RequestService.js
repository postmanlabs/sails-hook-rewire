/**
* RequestService
*
* @description :: Service to test sails-hook-rewire
*/

module.exports = {
  getRequestOptions: function (req) {
    return {
      query: req.query,
      body: req.body,
      headers: req.headers,
      url: req.protocol + '://' + req.headers.host + req.url
    };
  }
};
