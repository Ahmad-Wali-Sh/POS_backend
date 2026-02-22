const express = require('express')
const errorHandler = require('../utils/errorHandler')
const pool = require('../utils/pgClient')
const app = express()


app.get('/products', async (_, res) => {
    try {
        const products = await pool.query(`SELECT * FROM products;`)
        res.json(products.rows)
    }
    catch (error) { errorHandler(error, res) }
})


app.post('/products', async (req, res) => {
    try {
        const newProduct = req.body
        const { title, price, category_id, quantity, image } = newProduct
        await
            pool.query(
                `INSERT INTO products (title, price, category_id, quantity, image) 
                VALUES                ($1, $2, $3, $4, $5);
                `, [title, price, category_id, quantity, image])

        res.json({
            message: 'DATA Recorded Succesfully',
            data: newProduct
        })
    }
    catch (erorr) { errorHandler(erorr, res) }
})


app.put('/products/:id', async (req, res) => {
    try {
        const id = req.params.id
        const editProduct = req.body
        const { title, price, quantity, category_id, image } = editProduct

        await 
            pool.query(`
                UPDATE products set
                title = $1,
                price = $2,
                quantity = $3,
                category_id = $4,
                image = $5

                WHERE id = $6
            `, [title, price, quantity, category_id, image, id])

        res.json({
            message: 'Data Record Updated.',
            data: editProduct
        })  
    }
    catch (erorr) { errorHandler(erorr, res) }
})

module.exports = app