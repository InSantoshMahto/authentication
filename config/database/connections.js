// importing node modules
const mysql = require('mysql');

// importing configuration module
let credentials = require("./credentials");

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
    psql: {
        status: "i am fine"
    },
    mongodb: {
        status: "i am fine mongodb"
    }
};