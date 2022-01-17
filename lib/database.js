const settings = require('../settings');
const chalk = require('chalk');
const {log} = require('./log');
const { errorHandler } = require('./errorHandler');

//Initializes a MySQL database with the name tokentracker.
const createDB = async(connection)=>{
    return new Promise(async(resolve,reject)=>{
        try
        {
            let q1 = 'CREATE DATABASE IF NOT EXISTS tokentracker'
            connection.query(q1,(err,result)=>{
                    if(err) reject(err)
                    else
                    {
                        log(chalk.greenBright.bold(`Success initializing tokentracker database.`))
                        resolve(true)
                    }
                });   
        }
        catch(err)
        {
            console.log(`There was a problem creating tokentracker db.`)
            reject(err)
        }
    })  
}

//Creates a new table for the specified token in the tokentracker database.
const createTokenTable = async(connection,tokenTicker)=>{
    return new Promise(async(resolve,reject)=>{
        try
        {
            let q = `CREATE TABLE IF NOT EXISTS tokentracker.${tokenTicker} 
                (
                dataID INT NOT NULL AUTO_INCREMENT,
                dateTime DATETIME,
                xrpBid FLOAT, 
                xrpAsk FLOAT, 
                xrpSpot FLOAT, 
                usdBid FLOAT,
                usdAsk FLOAT,
                usdSpot FLOAT,
                totalTokensSellOffers FLOAT, 
                totalTokensSellOffersXrpValue FLOAT, 
                totalTokensSellOffersUsdValue FLOAT,
                totalTokensBuyOffers FLOAT,
                totalTokensBuyOffersXrpValue FLOAT,
                totalTokensBuyOffersUsdValue FLOAT,
                slippageTokensSellOffers FLOAT, 
                slippageTokensSellOffersXrpValue FLOAT,
                slippageTokensSellOffersUsdValue FLOAT,
                slippageTokensBuyOffers FLOAT, 
                slippageTokensBuyOffersXrpValue FLOAT,
                slippageTokensBuyOffersUsdValue FLOAT,
                PRIMARY KEY (dataID)
                )`     
            connection.query(q,(err,result)=>{
                if(err) throw err
                else
                {
                    log(chalk.greenBright.bold(`Success initializing ${tokenTicker} table.`))
                    resolve(true)
                }
            })
        }
        catch(err)
        {
            console.log(chalk.redBright.bold(`There was a problem creating table for $${tokenTicker}.`))
            reject(err)
        }
    })
}

//Inserts token price data into the table created for the token.
const insertTokenData = async (connection,tokenTicker,data) =>{
    return new Promise(async(resolve,reject)=>{
        try
        {
            let q = `INSERT INTO tokentracker.${tokenTicker}
                (dateTime,xrpBid, xrpAsk, xrpSpot, usdBid, usdASK, usdSpot,
                totalTokensSellOffers, 
                totalTokensSellOffersXrpValue, 
                totalTokensSellOffersUsdValue,
                totalTokensBuyOffers,
                totalTokensBuyOffersXrpValue,
                totalTokensBuyOffersUsdValue,
                slippageTokensSellOffers, 
                slippageTokensSellOffersXrpValue,
                slippageTokensSellOffersUsdValue,
                slippageTokensBuyOffers, 
                slippageTokensBuyOffersXrpValue,
                slippageTokensBuyOffersUsdValue
                )
                VALUES (NOW(),${data.xrpBid},${data.xrpAsk},${data.xrpSpot},${data.usdBid},${data.usdAsk},${data.usdSpot},
                    ${data.totalTokensSellOffers},
                    ${data.totalTokensSellOffersXrpValue},
                    ${data.totalTokensSellOffersUsdValue},
                    ${data.totalTokensBuyOffers},
                    ${data.totalTokensBuyOffersXrpValue},
                    ${data.totalTokensBuyOffersUsdValue},
                    ${data.slippageTokensSellOffers},
                    ${data.slippageTokensSellOffersXrpValue},
                    ${data.slippageTokensSellOffersUsdValue},
                    ${data.slippageTokensBuyOffers},
                    ${data.slippageTokensBuyOffersXrpValue},
                    ${data.slippageTokensBuyOffersUsdValue})
                `
                connection.query(q,(err,result)=>{
                    if(err) throw err
                    else
                    {
                        log(chalk.greenBright.bold(`Success Inserting Data into the ${tokenTicker} table.`))
                        resolve(true)
                    }
                })
        }
        catch(err)
        {
            console.log(chalk.redBright.bold(`There was a problem Inserting Data into $${tokenTicker}.`))
            reject(err)
        }
    })
}

//Initializes the tokentracker Database and Tables for all TOKENS in settings.
const initializeDB = async (connection)=>{
    return new Promise(async(resolve,reject)=>{
        try
        {
            log(chalk.yellowBright.bold(`Initializing tokentracker database and tables...`))
            await createDB(connection);
            await createTokenTable(connection,'xrp')
            for(let i = 0; i<settings.TOKENS.length; i++)
            {
                await createTokenTable(connection,settings.TOKENS[i].currency)
            }
            resolve()
        } 
        catch(err)
        {
            errorHandler(err)
            reject(err)
        }
    })
    
}

module.exports={initializeDB,insertTokenData}
