/*----------------------------SETTINGS----------------------------*/
const DB_CREDENTIALS =  {host:process.env.HOST,user:process.env.USER,password:process.env.PASSWORD }//DO NOT USE IN PRODUCTION ENVIRONMENTS
const XRPL_NODE="wss://xrplcluster.com/"
const CRON_TIME='* * * * *' //Specifies how often to run the script in crontab syntax
const SHOW_DATA=false; //Shows the calculated data in console (token price in XRP, token price in USD, Liquidity).
const VERBOSE=false; //Shows tasks as they are begun and completed.
const MAX_SLIPPAGE=.05; //Value between 0-1 to calculate liquidty for a given slippage percentage. (0 = 0%, 1 = 100% slippage)
const BASE={"currency":"XRP"} //XRP IS CURRENTLY THE ONLY SUPPORTED BASE. Changing will result in errors.
const TOKENS=[
       {"currency":"BTC", "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"},
       {"currency":"CSC", "issuer":"rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr"}  
] //The currency field must be exactly as it was issued. (VGB is not the same as vgb or VgB)
/*----------------------------------------------------------------*/

module.exports ={
XRPL_NODE,
DB_CREDENTIALS,
VERBOSE,
SHOW_DATA,
MAX_SLIPPAGE,
BASE,
TOKENS,
CRON_TIME
}