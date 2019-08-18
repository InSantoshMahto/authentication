module.exports = {
  // port
  port: 8585,

  // db
  mongoURI: 'mongodb://127.0.0.1/auth_local',

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
