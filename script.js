require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const { default: chalk } = require('chalk')
const PORT = process.env.PORT
const healthRoute = require('./routes/healthRoute')
const factoryRoutes = require('./routes/factory')

app.use(express.json())
app.use(express.static('public'))
app.use(cors())
app.use('', healthRoute)
app.use('/api', factoryRoutes)

app.listen(PORT || 8000, () => {
    console.log(chalk.bgGreen(`Server is Running On Port: ${PORT}`))
    console.log(chalk.bgBlue(`Health Check on URL: http://localhost:${PORT}/health`))
})
