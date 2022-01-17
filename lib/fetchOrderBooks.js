const xrpl = require('xrpl')

/* TODO:
 *  Get all orderbooks in one request and parse
 */
//Fetches orderbooks utilizing subscribe for parsing convenience.
let fetchOrderBooks = async (client,taker_gets,taker_pays) =>{
    return new Promise(async(resolve,reject)=>{
        try
        {
            let takerpays= JSON.parse(JSON.stringify(taker_pays))
            if(takerpays.currency.length>3)
            {
                takerpays.currency=xrpl.convertStringToHex(taker_pays.currency).padEnd(40,'0')
            }
            let request = 
            {
                "command":"subscribe",
                "books":[
                    {
                        "taker_gets":taker_gets,
                        "taker_pays":takerpays,
                        "snapshot":true,
                        "both":true
                    }, 
                ]
            }
            let orderBook = await client.request(request);
            request.command = "unsubscribe";
            await client.request(request)
            
            resolve(orderBook)
        }
        catch(err)
        {
            reject(err)
            
        }
    })
}

module.exports={fetchOrderBooks}