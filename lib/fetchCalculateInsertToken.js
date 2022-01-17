const {fetchOrderBooks} = require('./fetchOrderBooks');
const {calculateTokenData} = require('./calculateTokenData')
const {printData} = require('./printData')
const {insertTokenData} = require('./database');
const { errorHandler } = require('./errorHandler');
const { calculateXrpData } = require('./calculateXrpData');
const {log} = require('./log')
const settings = require('../settings')
const chalk = require('chalk')

//Fetches a tokens order book, calculates price/liquidity and stores in MySql database.
const fetchCalculateInsertToken = async (client,connection,base,token,xrpSpot,retryAttempt) =>{
    return new Promise(async(resolve,reject)=>{
        try{
                if(client.isConnected())
                    {
                        let tokenData;
                        log(chalk.yellowBright.bold(`Getting orderbooks for ${token.currency}`))
                        let tokenOrderbook = await fetchOrderBooks(client,base,token);
                        if(!tokenOrderbook.result.warnings)
                        {
                            if(tokenOrderbook.result.bids.length>0 && tokenOrderbook.result.asks.length>0)
                            {
                                log(chalk.greenBright.bold(`Success getting orderbooks for: ${token.currency}`))
                                log(chalk.yellowBright.bold(`Calculating tokendata for: ${token.currency}`))
                                if(base.currency==="USD")
                                {
                                    tokenData= await calculateXrpData(tokenOrderbook)
                                }
                                else
                                {
                                    tokenData = await calculateTokenData(tokenOrderbook,xrpSpot);
                                }
                                log(chalk.greenBright.bold(`Success calculating tokendata for: ${token.currency}`))
                                settings.SHOW_DATA==true?printData(token,tokenData):0
                                log(chalk.yellowBright.bold(`Inserting ${token.currency} to database.`))
                                await insertTokenData(connection,token.currency,tokenData)
                                log('---------------------------------------------')
                            }
                            else
                            {
                                errorHandler({data:{error_code:'NO_MARKET',ticker:token.currency}})
                                console.log(chalk.yellowBright.bold(`Continuing...`))
                                
                            }
                            resolve(tokenData)
                        }
                        else
                        {
                            if(tokenOrderbook.result.warnings[0].id===1004) throw {data:{code:'REPORTING_SERVER'}}
                            else throw tokenOrderbook.result.warnings
                        }
                    }
                    else if (retryAttempt) throw {data:{error_code:'FAILED_RECONNECTION'}}
                    else throw {data:{error_code:'NOT_CONNECTED',client:client}} 
            }
            catch(err)
            {
                let retry = await errorHandler(err)
                if(retry==true)
                {
                    resolve(await fetchCalculateInsertToken(client,connection,base,token,xrpSpot,retry))
                }
                else
                {
                    reject(retry)
                }
            }
        })

}

module.exports={fetchCalculateInsertToken}