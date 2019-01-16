'use strict'

// import 
// const express = require('express');
// const mysql = require('mysql');
const bcrypt = require('bcryptjs');
// const jwtSimple = require('jwt-simple');
// const objectHash = require('object-hash');
// const app = express();

let logout = (req, res) => {
    res.send({ status: 'logout' });
}

/* ==================== Export ====================  */
module.exports = {
    logout: logout
};