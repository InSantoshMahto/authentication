// importing node modules
const mysql = require('mysql');

// importing configuration module
let config = require("./credentials");

// exporting connections
module.exports = {
    mysql: () => {
        return mysql.createConnection({
            host: config.mysql.host,
            port: config.mysql.port,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database
        })
    },
    psql: {
        status: "i am fine"
    },
    mongodb: {
        status: "i am fine mongodb"
    }
};