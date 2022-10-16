import mysql from "mysql";

export const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs340_towlerj',
    password: '4942',
    database: 'cs340_towlerj'
});