import mysql from "mysql";

export const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'us-cdbr-east-06.cleardb.net',
    user: 'bdd317099a9c30',
    password: 'd18a7670',
    database: 'heroku_97690c0035aece8'
});