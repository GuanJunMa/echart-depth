# echart-depth

> A Vue.js project

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 最重要的处理函数

```
    formatterDepth (res) {
      var bids = res.data.bids
      var asks = res.data.asks
      var bidsTotal = 0
      var asksTotal = 0
      var maxBuyPrice = 0
      var minBuyPrice = 0
      var maxSellPrice = 0
      var minSellPrice = 0
      var buyAmounts = []
      var sellAmounts = []
      var buyPrices = []
      var sellPrices = []
      var amounts = []
      var prices = []
      var datas = []
      if (Array.isArray(bids) && bids.length > 0) {
        datas = []
        datas = bids.slice(0, 50)
        amounts = []
        prices = []
        for (var buyData of datas) {
          bidsTotal = bidsTotal + buyData.amount
          amounts.push(bidsTotal)
          prices.push(buyData.price)
        }
        maxBuyPrice = Math.max.apply(null, prices)
        minBuyPrice = Math.min.apply(null, prices)
        buyAmounts = amounts
        buyPrices = prices
      }
      if (Array.isArray(asks) && asks.length > 0) {
        datas = []
        datas = asks.slice(0, 50)
        amounts = []
        prices = []
        for (var sellData of datas) {
          asksTotal = asksTotal + sellData.amount
          amounts.push(asksTotal)
          prices.push(sellData.price)
        }
        maxSellPrice = Math.max.apply(null, prices)
        minSellPrice = Math.min.apply(null, prices)
        sellAmounts = amounts
        sellPrices = prices
      }
      var priceGap = maxSellPrice - minBuyPrice
      var buyPriceGap = maxBuyPrice - minBuyPrice
      var sellPriceGap = maxSellPrice - minSellPrice
      var buyPercent = buyPriceGap / priceGap
      if (buyPercent >= 0.75) {
        buyPercent = 0.75
      }
      if (buyPercent < 0.25) {
        buyPercent = 0.25
      }

      var sellPercent = sellPriceGap / priceGap
      if (sellPercent >= 0.75) {
        sellPercent = 0.75
      }
      if (sellPercent < 0.25) {
        sellPercent = 0.25
      }
      var maxAmount = Math.max(bidsTotal, asksTotal)
      // console.log('#######数据格式化完成#######')

      return {
        maxAmount,
        maxBuyPrice,
        minBuyPrice,
        maxSellPrice,
        minSellPrice,
        buyAmounts,
        buyPrices,
        sellPrices,
        sellAmounts,
        buyPercent,
        sellPercent
      }
    }
```
