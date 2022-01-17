const settings = require('../settings')
const xrpl = require('xrpl')

//Calculates an xrpl token's price and liquidity in terms of XRP and USD.
const calculateTokenData = async(orderbook,xrpSpot) =>{
    let asks = orderbook.result.asks;
    let bids = orderbook.result.bids;
    
    //CALCULATING TOKEN PRICE IN XRP AND USD
    let askPriceInXRP = 1/(asks[0].TakerGets.value/xrpl.dropsToXrp(asks[0].TakerPays))
    let bidPriceInXRP = 1/(bids[0].TakerPays.value/xrpl.dropsToXrp(bids[0].TakerGets))
    let spotPriceInXRP = (askPriceInXRP+bidPriceInXRP)/2
    let usdAskPrice = askPriceInXRP*xrpSpot
    let usdBidPrice = bidPriceInXRP*xrpSpot
    let usdSpot = spotPriceInXRP*xrpSpot

    //CALCULATING BUYING LIQUIDITY
    let askTotalTokens = 0;
    let askTotalXrpForBuyingTokens = 0;
    let slippageAskTotalTokens = 0;
    let slippageAskXrpForBuyingTokens = 0;

    let maxPurchasePriceAfterSlippage = (askPriceInXRP+(askPriceInXRP*settings.MAX_SLIPPAGE));
    for(let i=0;i<asks.length;i++)
    {
        let aAskPrice = 1/(asks[i].TakerGets.value/xrpl.dropsToXrp(asks[i].TakerPays))
        
        if(aAskPrice<maxPurchasePriceAfterSlippage)
        {
           slippageAskTotalTokens+=Number(asks[i].TakerGets.value)
            slippageAskXrpForBuyingTokens+=Number(xrpl.dropsToXrp(asks[i].TakerPays))
            askTotalTokens+=Number(asks[i].TakerGets.value)
            askTotalXrpForBuyingTokens+=Number(xrpl.dropsToXrp(asks[i].TakerPays))
        }
        else
        {
            askTotalTokens+=Number(asks[i].TakerGets.value)
            askTotalXrpForBuyingTokens+=Number(xrpl.dropsToXrp(asks[i].TakerPays))
        }
    }
    let totalUSDPurchaseLiquidity = askTotalXrpForBuyingTokens*xrpSpot
    let slippageUSDPurchaseLiquidity = slippageAskXrpForBuyingTokens*xrpSpot;

    //CALCULATING SELLING LIQUIDITY
    let bidTotalTokens =0;
    let bidTotalXrpForSellingTokens = 0;
    let slippageBidTotalTokens=0;
    let slippageBidXrpForSellingTokens =0;

    let minSalePriceAfterSlippage = (bidPriceInXRP-(bidPriceInXRP*settings.MAX_SLIPPAGE));
    
    for(let i = 0; i<bids.length;i++)
    {
        let aBidPrice = 1/(bids[i].TakerPays.value/xrpl.dropsToXrp(bids[i].TakerGets))
        
        if(aBidPrice>minSalePriceAfterSlippage)
        {
            bidTotalTokens+=Number(bids[i].TakerPays.value)
            bidTotalXrpForSellingTokens+=Number(xrpl.dropsToXrp(bids[i].TakerGets))
            slippageBidTotalTokens+=Number(bids[i].TakerPays.value)
            slippageBidXrpForSellingTokens+=Number(xrpl.dropsToXrp(bids[i].TakerGets))        
        }
        else
        {
            bidTotalTokens+=Number(bids[i].TakerPays.value)
            bidTotalXrpForSellingTokens+=Number(xrpl.dropsToXrp(bids[i].TakerGets))
        }
    }
    let totalUSDSaleLiquidity = bidTotalXrpForSellingTokens*xrpSpot
    let slippageUSDSaleLiquidity =slippageBidXrpForSellingTokens*xrpSpot;

    let data = 
    {
        xrpAsk:askPriceInXRP,
        xrpSpot:spotPriceInXRP,
        xrpBid:bidPriceInXRP,
        
        usdAsk:usdAskPrice,
        usdSpot:usdSpot,
        usdBid:usdBidPrice,

        totalTokensSellOffers:askTotalTokens,
        totalTokensSellOffersXrpValue:askTotalXrpForBuyingTokens,
        totalTokensSellOffersUsdValue:totalUSDPurchaseLiquidity,

        totalTokensBuyOffers:bidTotalTokens,
        totalTokensBuyOffersXrpValue:bidTotalXrpForSellingTokens,
        totalTokensBuyOffersUsdValue:totalUSDSaleLiquidity,

        slippageTokensSellOffers:slippageAskTotalTokens,
        slippageTokensSellOffersXrpValue:slippageAskXrpForBuyingTokens,
        slippageTokensSellOffersUsdValue:slippageUSDPurchaseLiquidity,
        
        slippageTokensBuyOffers:slippageBidTotalTokens,
        slippageTokensBuyOffersXrpValue:slippageBidXrpForSellingTokens,
        slippageTokensBuyOffersUsdValue:slippageUSDSaleLiquidity,
    }

    return data;
}

module.exports ={calculateTokenData}