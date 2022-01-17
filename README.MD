# XRPL-Token-Tracker

A foundation for creating and maintaining MySQL database tables for historical price/liquidity information for [XRPL](xrpl.org) tokens. Tracking and storing price/liquidity is useful for creating historical charts for XRPL tokens. 

🐉 **This is the ALPHA release of the tool. Expect dragons!** 🐉

## Pre-requisites
* [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
* [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed 
###### Tested with: MySQL Community v8.0.12, Node.js v14.17.0 and npm v7.24.2


## Installation
1) Clone or download the repository to your local machine.
2) Open a terminal in the root directory of the project.

```bash
npm install
```

## Modify Settings:
1) In your favorite IDE open the **settings.js** file.
2) You will be presented with several options to adjust how your tool will run:
## Settings:
1) **DB_CREDENTIALS**: The host, user and password of a MySQL server instance. The server must be running and and the user/ password must be pre-configured prior to launching entering the credentials. **It is not recommended to store your DB credentials directly in here. Use [environmental variables](https://www.twilio.com/blog/2017/08/working-with-environment-variables-in-node-js.html)**

2) **XRPL_NODE**: The WSS URL of the xrpl node you would like to connect to. Be sure that the node is not operating as a reporting server or the tool will not work.

3) **CRON_TIME**: Specifies how often the tool will pull token data utilizing [crontab syntax](https://www.tutorialspoint.com/unix_commands/crontab.htm). The default settings will pull data every minute.

4) **SHOW_DATA**: (true/false) Determines if the calculated data (prices/liquidity) will be displayed in the console as the data is calculated. 

5) **VERBOSE**: (true/false) Determines if the tool will show logs of the tasks that it is working on or has recently completed. 

6) **MAX_SLIPPAGE**: (0-1) Used for calculating [slippage](https://www.investopedia.com/terms/s/slippage.asp) liquidity (How many tokens can be purchased or sold before the price change would be greater than the slippage tolerance)

7) **BASE**: The  base currency to calculate token values against. **CURRENTLY ONLY XRP IS SUPPORTED. DO NOT CHANGE** 

8) **TOKENS**: A list of tokens to track the prices and liquidity of. **THE CURRENCY FIELD IS CASE SENSITVE.** bTc is not the same as BTC! If unsure of the correct ticker, look up the issuing account on [Bithomp](https://bithomp.com/explorer/) and refer to the obligations of the issuer to get the appropriate ticker for the token.

  
#### Example Settings:
```javascript
/*----------------------------SETTINGS----------------------------*/
const DB_CREDENTIALS =  {host:"localhost",user:process.env.DB_USER,password:process.env.DB_PASSWORD }
const XRPL_NODE="wss://xrplcluster.com/"
const CRON_TIME='* * * * *' 
const SHOW_DATA=false; 
const VERBOSE=false; 
const MAX_SLIPPAGE=.05; 
const BASE={"currency":"XRP"} 
const TOKENS=[
       {"currency":"BTC", "issuer":"rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B"},
       {"currency":"CSC", "issuer":"rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr"},
]
/*----------------------------------------------------------------*/
```

## Usage 
Open a terminal in the root directory of the tool and run:
```bash
node tokentracker.js
```
## Contributions 
Pull requests are welcome! For major changes, please open an issue first to discuss what changes you would like to make.

## Feature Requests
Please open a discussion for any other token metrics that would be beneficial to track. 

## Issues
This project was put together in two days and it is very likely there will be unforeseen issues. To make this tool better, please report any errors or fatal crashes that are encountered. 

## Road map
In future releases, the tool will diverge from utilizing [node-cron](https://www.npmjs.com/package/node-cron) and will be executed from a bash script and scheduled utilizing [crontab](https://www.tutorialspoint.com/unix_commands/crontab.htm)

## License
[MIT](https://choosealicense.com/licenses/mit/)