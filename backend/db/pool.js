const pg = require('pg');

const pool = new pg.Pool({
    user: 'postgres',
    host: '18.197.60.144',
    database: 'game',
    password: '******',
    port: 5432
});
module.exports = pool;