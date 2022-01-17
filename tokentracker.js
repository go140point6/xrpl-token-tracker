const xrpl = require('xrpl');
const mysql = require('mysql');
const settings = require('./settings')
const chalk = require('chalk')
const cron = require('node-cron')
const {initializeDB,fetchCalculateInsertToken,log} = require('./lib');

/* 
*  Title: XRPL-Token-Tracker
*  Version: 0.1.0
*  Summary: Periodically fetches and stores Prices and Liquidity for a list of XRPL Tokens.
*  Description: Initializes a MySQL server connection and creates a database and tables
*               for all tokens specified in the settings. After MySQL initialization, 
*               we fetch and calculate the price/liquidty of the specified tokens and 
*               store them in the appropriate MySql table.               
*  Author: https://twitter.com/MikeCheckYaSelf 
*  Organization: X-Tokenize
*/

const main = async()=>{
    console.log(chalk.greenBright.bold(`Running...`))
    try
    {
        const connection = mysql.createConnection(settings.DB_CREDENTIALS);
        await initializeDB(connection);
        log(chalk.greenBright.bold('Success initializing database.'))

        log(chalk.yellowBright.bold(`Connecting to the XRPL`))
        const client = new xrpl.Client(settings.XRPL_NODE)
        await client.connect()
        log(chalk.greenBright.bold(`Connected to the XRPL`))

        let xrpData = await fetchCalculateInsertToken(client,connection,{"currency":"USD", "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"},{"currency":"XRP"},1)
        let xrpSpot = xrpData.usdSpot;

        for(let i =0;i<settings.TOKENS.length;i++)
        {
            await fetchCalculateInsertToken(client,connection,settings.BASE,settings.TOKENS[i],xrpSpot);
        }  
        connection.destroy();
        await client.disconnect()
        console.log(chalk.greenBright.bold(`Finished!`))
    }
    catch(err)
    {
        console.log(err)
        console.log(chalk.redBright.bold(`Exiting...`))
        process.exit();
    }
}
let task = cron.schedule(settings.CRON_TIME, () =>{main();});
  
task.start();

