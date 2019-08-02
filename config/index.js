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

// console.log(config.db);

// exports
module.exports = config;
