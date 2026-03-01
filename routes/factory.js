const express = require('express')
const errorHandler = require('../utils/errorHandler')
const pool = require('../utils/pgClient')
const app = express()


const MODELS = [
    {
        route: 'products',
        table: 'products',
        fields: ['title', 'price', 'quantity', 'category_id', 'image']
    },
    {
        route: 'customers',
        table: 'customers',
        fields: ['name', 'fathername', 'job', 'age', 'phone', 'gender', 'profit', 'image']
    },
    {
        route: 'users',
        table: 'users',
        fields: ['username', 'password', 'fullname', 'image', 'bio']
    },
    {
        route: 'categories',
        table: 'categories',
        fields: ['name', 'description']
    },
    {
        route: 'sale-transactions',
        table: 'saleTransaction',
        fields: ['customer_id', 'subtotal', 'discount', 'payable_amount', 'isPaid']
    },
    {
        route: 'sale-items',
        table: 'saleItem',
        fields: ['sale_id', 'product_id', 'each_price', 'quantity', 'discount', 'total']
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
            const fields = Object.keys(newItem).join(', ')
            const values = Object.keys(newItem).map((_, index) => {
                return `$${index + 1}`
            }).join(',')
            const valueParameters = Object.values(newItem)
            await
                pool.query(`
                    INSERT INTO ${model.table} (${fields}) 
                    VALUES (${values});
                `, 
                valueParameters)
            const item = await pool.query(`SELECT * FROM ${model.table} ORDER BY id DESC LIMIT 1;`)
            res.json({
                message: 'DATA Recorded Succesfully',
                data: item?.rows[0]
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
            const idRoute = `$${keys.length + 1}`
            const values = Object.values(editItem)
            values.push(id)
            await pool.query(`
                UPDATE ${model.table} SET
                ${fields}
                WHERE id = ${idRoute}
            `, values)

            res.json({
                message: 'DATA Recorded Succesfully',
                data: editItem
            })
        }
        catch (erorr) { errorHandler(erorr, res) }
    })


    app.get(`/${model.route}/:id`, async (req, res) => {
        try {
            const id = req.params.id
            const data = await pool.query(`SELECT * FROM ${model.table} WHERE id = $1;`, [id])
            res.json(data?.rows[0] ? data.rows[0] : {})
        }
        catch (erorr) { errorHandler(erorr, res) }
    })

    app.delete(`/${model.route}/:id`, async (req, res) => {
        try {
            const id = req.params.id
            await pool.query(`DELETE FROM ${model.table} WHERE id = $1`, [id])
            res.json({ message: 'Record Deleted Succesfully.' })
        }
        catch (erorr) { errorHandler(erorr, res) }
    })
})

module.exports = app
