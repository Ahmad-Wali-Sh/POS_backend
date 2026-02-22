const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'posDB',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
})

module.exports = pool