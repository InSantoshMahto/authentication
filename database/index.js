// importing node modules
const mysql = require('mysql');

// importing database configurations
let config = require("./config");

// importing functionalities
let auth = require('./auth');

// getting mysql database access as a conToMySql i.e, connectionForMySql 
let conToMySql = config.mysql();

// export
module.exports = {
    getConnection: {
        mysql: conToMySql
    },
    auth: {
        dashboard: auth.dashboard,
        register: auth.register,
        login: auth.login,
        forPassword: auth.forPassword
    }
}