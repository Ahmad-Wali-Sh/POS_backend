const express = require('express')
const app = express()
const pool = require('../utils/pgClient')
const { default: chalk } = require('chalk')

app.get('/health', (_,res) => {
    res.json({message: `Server is Running on PORT`})
})

app.get('/db-health', async (_,res) => {
    try {
        await pool.query(`SELECT * FROM products;`)
        res.json({message: 'DB is Active.'})
    }
    catch (err) {
        console.log(chalk.bgRed(err))
        res.json({message: "DB Error"})
    }
})

module.exports = app