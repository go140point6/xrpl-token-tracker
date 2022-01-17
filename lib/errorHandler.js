const chalk = require('chalk')

//Describes/handles some common errors a user might encounter.
const errorHandler = async (err) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            console.log(chalk.redBright.bold('Seems like we ran into an issue.'))
            console.log(err)
            if(err.code) //MySQL errors
            {
                switch(err.code)
                {
                    case 'ENOTFOUND':
                        resolve(console.log(chalk.redBright.bold('Check the database connection host.')))
                        break;
                    case 'ER_NOT_SUPPORTED_AUTH_MODE':
                        resolve(console.log(chalk.redBright.bold('Check the database user name.')))
                        break;
                    case 'ER_ACCESS_DENIED_ERROR':
                        resolve(console.log(chalk.redBright.bold('Check the database user password.')))
                        break;
                    case 'FAILED_TO_INITIALIZE':
                        resolve(console.log(chalk.redBright.bold('Failed to initialize database.')))
                        break;
                }
            }
            else if(err.data && err.data.code) //rippled errors
            {
                switch (err.data.code)
                {
                    case 'ENOTFOUND':
                        resolve(console.log(chalk.redBright.bold('Check the XRPL_NODE setting.')))
                        break;
                    case 'REPORTING_SERVER':
                        resolve(console.log(chalk.redBright.bold('Selected node is a reporting server. Please choose another xrpl node.')))
                        break;          
                }
            }
            else if(err.data && err.data.error_code) //xrpl.js and custom errors
            {
                switch (err.data.error_code) 
                {
                    case 'NO_MARKET':
                        resolve(console.log(chalk.yellowBright.bold(`There is no market for the ${err.data.ticker} token..`)))
                        break
                    case 'NOT_CONNECTED':
                        console.log(chalk.redBright.bold(`Lost connection to the XRPL node.`))
                        if(err.data.client)
                        {
                            await err.data.client.connect();
                            console.log(chalk.yellowBright.bold('Attempting to reconnect to the XRPL.'))
                            if(err.data.client.isConnected())
                            {
                                console.log(chalk.greenBright.bold('Success reconnecting to the XRPL.'))
                                resolve(true)
                            }
                            else
                            {
                                resolve({data:{error_code:'FAILED_RECONNECTION'}})
                            } 
                        }
                        break
                
                    case 'FAILED_RECONNECTION':
                        resolve(console.log(chalk.redBright.bold('Failed to reconnect to the XRPL node.')))
                        break;

                    case 51:
                        resolve(console.log(chalk.redBright.bold(`Check the BASE currency setting `)))
                        break
                }
            }
            else
            {
                throw err
            }  
        }
        catch(err)
        {
            console.log(chalk.redBright.bold('Please report this problem!'))
            console.log(chalk.redBright.bold(`UNHANDLED ERROR:${err}`))
        }
    })
}

module.exports={errorHandler}