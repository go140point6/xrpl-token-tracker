const chalk = require('chalk')

//Prints data in the console if the user would like to view the price/liquidity data.
const printData = (ticker,data)=>
{
    console.log()
    console.log(chalk.cyanBright.bold(`--------------------------${ticker.currency}--------------------------`))
    console.table(data)
}

module.exports ={printData}