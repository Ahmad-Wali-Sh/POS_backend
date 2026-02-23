const express = require('express')
const errorHandler = require('../utils/errorHandler')
const pool = require('../utils/pgClient')
const app = express()


const MODELS = [
    {
        route: 'customers',
        table: 'customers',
        fields: ['name', 'fathername', 'job', 'age', 'phone', 'gender', 'profit', 'image']
    },
    {
        route: 'users',
        table: 'users',
        fields: ['username', 'password', 'fullname', 'image', 'bio']
    }
]

MODELS.forEach((model) => {
    //  List... 
    app.get(`/${model.route}`, async (_, res) => {
        try {
            const data = await pool.query(`SELECT * FROM ${model.table};`)
            res.json(data.rows)
        }
        catch (error) { errorHandler(error, res) }
    })

    // INSERT
    app.post(`/${model.route}`, async (req, res) => {
    try {
        const newItem = req.body
        const fields = model.fields.join(',')
        const values = model.fields.map((_, index) => {
            return `$${index + 1}`
        }).join(',')
        const data = Object.values(newItem)
        await
            pool.query(
                `INSERT INTO ${model.table} (${fields}) 
                VALUES                (${values});
                `,data)

        res.json({
            message: 'DATA Recorded Succesfully',
            data: newItem
        })
    }
    catch (erorr) { errorHandler(erorr, res) }  
})

    // Edit
    app.put(`/${model.route}/:id`, async (req, res) => {
    try {
        const id = req.params.id
        const editItem = req.body
        const keys = Object.keys(editItem)
        const fields = keys.map((key, index) => {
            return `${key} = $${index + 1}`
        }).join(',')
        const values = Object.values(editItem)

        await pool.query(`
                UPDATE ${model.table} SET
                ${fields}
                WHERE id = ${id}
            `, values)

        res.json({
            message: 'DATA Recorded Succesfully',
            data: editItem
        })
    }
    catch (erorr) { errorHandler(erorr, res) }  
})

})

module.exports = app
