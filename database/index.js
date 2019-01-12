// importing node modules
const mysql = require('mysql');

// importing database connection 
let connection = require("./connection");

// selecting mysql db
let conn = connection.mysql();

// connecting to db
conn.connect((err) => {

    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + conn.threadId);
});

const { Client } = require('pg');
const client = new Client();

await client.connect();

const res = await client.query('SELECT $1::text as message', ['Hello world!'])
console.log(res.rows[0].message) // Hello world!
await client.end()

// conn.query('SELECT * FROM records;', function(error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results[0].solution);
// });

conn.end();