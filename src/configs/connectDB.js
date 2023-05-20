// get the client
import mysql from 'mysql2/promise';

// create the connection to database
console.log("Create connnection to database");
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'db_tmdt2'
})

export default pool;
