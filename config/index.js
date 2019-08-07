/**
 * Modules: Default configuration
 * By: Santosh Mahto
 * Date: 23-01-2019
 */

'use strict';

//  imports
let db = require('./database');

// declare config objects
let config = {};

// db
config.db = db;

// json config
config.json = {
  inflate: true,
  strict: true,
};

// static config
config.static = {
  dotfiles: 'allow',
  etag: true,
  extensions: false,
  lastModified: true,
  redirect: true,
  index: 'index.html',
};
// router config
config.router = {
  caseSensitive: false,
  mergeParams: false,
  strict: false,
};

// console.log(config.db);

// exports
module.exports = config;
