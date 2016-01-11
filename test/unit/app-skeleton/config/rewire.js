module.exports.rewire = {
  controllers: [
    {
      name: 'FileController'
    },
    {
      name: 'DNSLookUpController',
      global: true
    }
  ],
  services: [
    {
      name: 'FetchService',
      global: true
    },
    {
      name: 'FileService',
      global: false
    }
  ]
};
