const { default: chalk } = require("chalk")


const errorHandler = (error, res) => {
    console.log(chalk.bgRed(error))
    res.json({message: 'DB Error'})
}


module.exports = errorHandler