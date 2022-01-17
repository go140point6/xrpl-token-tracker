const settings = require('../settings')
const xrpl = require('xrpl')

//Calculates XRP-USD price/liquidity.
const calculateXrpData = async(orderbook) =>{
    let asks = orderbook.result.asks;
    let bids = orderbook.result.bids;

    //CALCULATING TOKEN PRICE IN USD
    let usdAskPrice = (asks[0].TakerPays.value/xrpl.dropsToXrp(asks[0].TakerGets))
    let usdBidPrice = (bids[0].TakerGets.value/xrpl.dropsToXrp(bids[0].TakerPays))
    let usdSpot = (usdAskPrice+usdBidPrice)/2
    
    //CALCULATING BUYING LIQUIDITY
    let slippageTokenPurchaseLiquidity = 0;
    let slippageTokensForSale =0;
    let totalPuchaseLiquidity = 0;
    let totalTokensForSale=0;
    let maxPurchasePriceAfterSlippage = (usdAskPrice+(usdAskPrice*settings.MAX_SLIPPAGE));
    for(let j=0;j<asks.length;j++)
    {
        let aAskPrice = (asks[j].TakerPays.value/xrpl.dropsToXrp(asks[j].TakerGets))
        if(aAskPrice<maxPurchasePriceAfterSlippage)
        {
            slippageTokenPurchaseLiquidity+=Number(asks[j].TakerPays.value);
            slippageTokensForSale+=Number(xrpl.dropsToXrp(asks[j].TakerGets));

            totalPuchaseLiquidity+=Number(asks[j].TakerPays.value);
            totalTokensForSale+=Number(xrpl.dropsToXrp(asks[j].TakerGets)) 
        }
        else
        {
            totalPuchaseLiquidity+=Number(asks[j].TakerPays.value);
            totalTokensForSale+=Number(xrpl.dropsToXrp(asks[j].TakerGets)) 
        }
    }
    let averageSlippagePurchasePrice = slippageTokenPurchaseLiquidity/slippageTokensForSale
    let totalUSDPurchaseLiquidity = totalPuchaseLiquidity
    let slippageTokenSaleOffersUSD = slippageTokenPurchaseLiquidity;

    //CALCULATING SELLING LIQUIDITY
    let slippageTokenSaleLiquidity = 0;
    let slippageTokenSaleValue=0;
    let totalSaleLiquidity=0;
    let totalTokenPurchaseValue =0;
    let minSalePriceAfterSlippage = (usdBidPrice-(usdBidPrice*settings.MAX_SLIPPAGE));
    for(let y = 0; y<bids.length-1;y++)
    {
        let aBidPrice = (bids[y].TakerGets.value/xrpl.dropsToXrp(bids[y].TakerPays))
        if(aBidPrice>minSalePriceAfterSlippage)
        {
            slippageTokenSaleLiquidity+=Number(xrpl.dropsToXrp(bids[y].TakerPays))
            slippageTokenSaleValue+=Number(bids[y].TakerGets.value)
            totalSaleLiquidity+=Number(xrpl.dropsToXrp(bids[y].TakerPays));
            totalTokenPurchaseValue+=Number(bids[y].TakerGets.value) 
        }
        else
        {
            totalSaleLiquidity+=Number(xrpl.dropsToXrp(bids[y].TakerPays));
            totalTokenPurchaseValue+=Number(bids[y].TakerGets.value) 
        }
    
    }
    let averageSlippageSalePrice= slippageTokenSaleValue/slippageTokenSaleLiquidity;
    let totalUSDSaleLiquidity = totalSaleLiquidity
    let slippageTokenBuyOffersUSD =slippageTokenSaleValue;

    let data = 
    {
        xrpAsk:1,
        xrpSpot:1,
        xrpBid:1,
        usdAsk:usdAskPrice,
        usdSpot:usdSpot,
        usdBid:usdBidPrice,
        totalTokensSellOffers:totalTokensForSale,
        totalTokensSellOffersXrpValue:1,
        totalTokensSellOffersUsdValue:totalUSDPurchaseLiquidity,
        totalTokensBuyOffers:totalTokenPurchaseValue,
        totalTokensBuyOffersXrpValue:1,
        totalTokensBuyOffersUsdValue:totalUSDSaleLiquidity,
        slippageTokensSellOffers:slippageTokensForSale,
        slippageTokensSellOffersXrpValue:1,
        slippageTokensSellOffersUsdValue:slippageTokenSaleOffersUSD,
        slippageTokensBuyOffers:slippageTokenSaleLiquidity,
        slippageTokensBuyOffersXrpValue:1,
        slippageTokensBuyOffersUsdValue:slippageTokenBuyOffersUSD,
    }
    return data;
}


module.exports ={calculateXrpData}