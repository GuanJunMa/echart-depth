<template>
  <div class="depth">
    <div
      id='depth'
      class="depth"
    ></div>
  </div>
</template>
<script>
const echarts = require('echarts')
import service from '../js/service.js'
export default {
  name: 'Depth',
  data () {
    return {
      depth: null,
      depthData: null,
      data: null,
      id: '',
      coin: [
        'BTC_USDT',
        'BTC_ETH'
      ],
      cycle: 5000,
      width: 100,
      height: 88
    }
  },
  watch: {
    // getKey () {
    //   this.getDepthData('change')
    // }
  },
  computed: {
    // ...mapGetters(['getKey'])
  },
  mounted () {
    clearInterval(this.id)
    this.fetchData()
    // 定时刷新
    this.id = setInterval(this.fetchData, this.cycle)
    // 监听窗口变化
    window.onresize = () => {
      // $('#depth').removeAttr('_echarts_instance_')
      this.init()
      this.setOption(this.depthData)
    }
  },
  beforeDestroy () {
    clearInterval(this.id)
    if (this.depth) {
      this.depth.clear()
    }
  },
  methods: {
    // 请求数据
    fetchData() {
      let data = {}
      const success = res => {
        if (res.code === "0" && res.data) {
          this.depthData = this.formatterDepth(res)
          // console.log('#######请求完成#######')
          // 处理数据 格式化
          this.init()
          this.setOption(this.depthData)
        } else {
          var data = {
            data: {
              bids: [],
              asks: []
            }
          }
          this.depthData = this.formatterDepth(data)
          this.init()
          this.setOption(this.depthData)
        }
      }
      service.getDepth(data, success)
    },
    // 得到路由携带值
    getQuery () {
      // if ()
    },
    getDepthData (type) {
      // 请求数据
      // getDepth(this.getKey).then((res) => {
      //   if (res.code === 0 && res.data) {
      //     this.depthData = this.formatterDepth(res)
      //     // console.log('#######请求完成#######')
      //     // 处理数据 格式化
      //     this.init(type)
      //     this.setOption(this.depthData)
      //   } else {
      //     var data = {
      //       data: {
      //         bids: [],
      //         asks: []
      //       }
      //     }
      //     this.depthData = this.formatterDepth(data)
      //     this.init(type)
      //     this.setOption(this.depthData)
      //   }
      // })
    },
    formatterDepth (res) {
      console.log(res)
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
    },
    init () {
      if (this.depth) {
        this.depth.clear()
      }
      if (!this.depth) {
        this.depth = echarts.init(document.getElementById('depth'))
        // console.log('#######init完成#######')
      }
    },
    setOption (data) {
      // console.log('#######setOption#######')
      this.depth.setOption({
        backgroundColor: '#191D2D',
        animation: true,
        axisPointer: {
          link: {
            // yAxisIndex: [0, 1]
          },
          label: {
            // backgroundColor: "#777"
          }
        },
        grid: this.getGrid(data),
        tooltip: this.getToolTip(data),
        yAxis: this.getYAxis(data),
        xAxis: this.getXAxis(data),
        series: this.getSeries(data)
      }, true)
      // console.log('#######setOption完成#######')
    },
    getGrid (data) {
      return [
        {
          bottom: 20,
          left: this.width * (1 - data.sellPercent) + '%',
          height: '85%',
          right: '3%',
          width: this.width * (data.sellPercent - 0.03) + '%'
        },
        {
          bottom: 20,
          left: '3%',
          right: 0,
          height: '85%',
          width: this.width * (data.buyPercent - 0.03) + '%'
        }
      ]
    },
    getYAxis (data) {
      return [
        {
          show: false,
          type: 'value',
          gridIndex: 0,
          scale: true,
          position: 'right',
          min: 0,
          minInterval: 'auto',
          axisLine: {
            onZero: false,
            lineStyle: {
              // 坐标轴颜色
              color: '#4E5474'
            }
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          // 辅助线
          axisPointer: {
            show: false,
            lineStyle: {
              color: '#2A2C35',
              type: 'dotted'
            }
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true,
            inside: false
            // color: 'red'
          },
          max: data.maxAmount
        },
        {
          show: false,
          position: 'left',
          type: 'value',
          gridIndex: 1,
          scale: true,
          axisLine: {
            onZero: false,
            lineStyle: {
              // 坐标轴颜色
              color: '#c2c2c2'
            }
          },
          // 辅助线
          axisPointer: {
            show: false,
            lineStyle: {
              color: '#2A2C35',
              type: 'dotted'
            }
          },
          splitArea: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          min: 0,
          max: data.maxAmount
        }
      ]
    },
    getXAxis (data) {
      return [
        {
          show: true,
          type: 'category',
          gridIndex: 0,
          data: data.sellPrices,
          boundaryGap: false,
          splitArea: {
            show: false
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#AE3D42',
              type: 'dotted'
            }
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#2A2C35'
            }
          },
          // 辅助线
          axisPointer: {
            // show: false,
            lineStyle: {
              color: '#2A2C35',
              type: 'dotted'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            margin: 8,
            showMinLabel: true,
            showMaxLabel: true,
            interval: 'auto',
            // 价格字体颜色
            color: '#c2c2c2',
            fontSize: 10,
            verticalAlign: 'middle',
            textStyle: {
              align: 'left'
            }
          }
        },
        {
          show: true,
          type: 'category',
          gridIndex: 1,
          data: data.buyPrices,
          boundaryGap: false,
          splitArea: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#37404b',
              type: 'dotted'
            }
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#2A2C35'
            }
          },
          // 辅助线
          axisPointer: {
            // show: false,
            lineStyle: {
              color: '#2A2C35',
              type: 'dotted'
            }
          },
          axisTick: {
            show: false
          },
          inverse: true,
          axisLabel: {
            show: true,
            margin: 8,
            showMinLabel: true,
            showMaxLabel: true,
            interval: 'auto',
            color: '#c2c2c2',
            fontSize: 10,
            verticalAlign: 'middle',
            textStyle: {
              align: 'right'
            }
          }
        }
      ]
    },
    getSeries (data) {
      return [
        {
          name: 'sell',
          type: 'line',
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                // 渐变色
                colorStops: [
                  {
                    offset: 0,
                    color: '#691d1d'
                  },
                  {
                    offset: 1,
                    color: '#732121'
                  }
                ]
              }
            }
          },
          itemStyle: {
            normal: {
              color: '#28b869'
            }
          },
          step: 'end',
          data: data.sellAmounts,
          smooth: false,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2,
              // 线的颜色
              color: '#912928',
              opacity: 1
            }
          },
          xAxisIndex: 0,
          yAxisIndex: 0
        },
        {
          name: 'buy',
          type: 'line',
          areaStyle: {
            normal: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#234524'
                  },
                  {
                    offset: 1,
                    color: '#27522e'
                  }
                ]
              }
            }
          },
          itemStyle: {
            normal: {
              color: '#ee4a4a'
            }
          },
          step: 'end',
          data: data.buyAmounts,
          smooth: false,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 2,
              color: '#2d7d34',
              opacity: 1
            }
          },
          xAxisIndex: 1,
          yAxisIndex: 1
        }
      ]
    },
    getToolTip (data) {
      return {
        trigger: 'axis',
        animation: false,
        axisPointer: {
          type: 'cross',
          link: { xAxisIndex: 'all' }
        },
        backgroundColor: 'rgba(245, 245, 245, 0.5)',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000'
        },
        extraCssText:
          'width: 130px;background:#252332;border:0;color:#ffffff;opacity: 0.7;font-size:12px;',
        formatter: function (param) {
          param = param[0]
          if (param.seriesName === 'sell') {
            return [
              '<div style="text-align:left;">',
              '<div style="width:6px;height:6px;background:#AE3D42;border-radius:4px;float:left;margin-top:8px;margin-right:2px;"></div>' +
              '卖出价格: ' +
              param.axisValue +
              '<br/>',
              '<div style="width:6px;height:6px;background:#AE3D42;border-radius:4px;float:left;margin-top:8px;margin-right:2px;"></div>' +
              '卖出累计: ' +
              // formatDecimal(param.data, 4, 1) +
              '<br/>',
              '</div>'
            ].join('')
          } else if (param.seriesName === 'buy') {
            return [
              '<div style="text-align:left;">',
              '<div style="width:6px;height:6px;background:#38BC74;border-radius:4px;float:left;margin-top:8px;margin-right:2px;"></div>' +
              '买入价格: ' +
              param.axisValue +
              '<br/>',
              '<div style="width:6px;height:6px;background:#38BC74;border-radius:4px;float:left;margin-top:8px;margin-right:2px;"></div>' +
              '买入累计: ' +
              // formatDecimal(param.data, 4, 1) +
              '<br/>',
              '</div>'
            ].join('')
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.depth {
  height: calc(100vh - 328px);
  width: 100%;
}
</style>
