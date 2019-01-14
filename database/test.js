// importing node modules
const mysql = require('mysql');

// importing database connection 
let connection = require("./connection");

// selecting mysql db
let conn = connection.mysql();

// login function 
module.exports = (req, res) => {
    // connecting to db
    conn.connect((err) => {

        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + conn.threadId);
    });

    conn.query('SELECT * FROM users;', function(error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0]);
    });

    conn.end();
    res.send("ok");
}