const { Client } = require('pg');

module.exports =
{
    client: new Client({
        user: 'postgres',
        host: 'localhost',
        database: '1web',
        password: '1',
        port: 5432,
    })
}  
