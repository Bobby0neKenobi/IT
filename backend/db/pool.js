const pg = require('pg');

const pool = new pg.Pool({
    user: 'postgres',
    host: '18.197.60.144',
    database: 'game',
    password: 'IT_Pr0ject_datab@se',
    port: 5432
});
module.exports = pool;