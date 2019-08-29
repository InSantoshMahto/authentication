module.exports = {
  // port
  port: 8200,

  // db
  mongoURI: 'mongodb://onsi:onsi%4012345@ds021915.mlab.com:21915/auth',

  // MIME json
  json: {
    inflate: true,
    strict: true,
  },

  // static
  static: {
    dotfiles: 'allow',
    etag: true,
    extensions: false,
    lastModified: true,
    redirect: true,
    index: 'index.html',
  },

  // router
  router: {
    caseSensitive: false,
    mergeParams: false,
    strict: false,
  },

  // email
  email: {
    userId: 'noreply@onsi.in',
    password: 'Noreply@12345',
  },
};
