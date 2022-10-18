import mysql from "mysql";

export const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'qvti2nukhfiig51b.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'rtwzvfmxgcyvjsxz',
    password: 'kwaxyvtnu93mmw6n',
    database: 'c3icobtpifsa6k4d'
});