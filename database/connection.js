// importing node modules
const mysql = require('mysql');

// importing configuration module
let config = require("./config");

// exporting connections
module.exports = {
    mysql: () => {
        return mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database
        })
    },
    psql: {
        status: "i am fine"
    }
};