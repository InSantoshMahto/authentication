// importing node modules
const mysql = require('mysql');

// importing configuration module
const credentials = require("./credentials");

// exporting connections
module.exports = {
    mysql: () => {
        return mysql.createConnection({
            host: credentials.mysql.host,
            port: credentials.mysql.port,
            user: credentials.mysql.user,
            password: credentials.mysql.password,
            database: credentials.mysql.database
        })
    },
    ps: {
        status: "i am fine"
    },
    mongo: {
        status: "i am fine mongodb"
    }
};