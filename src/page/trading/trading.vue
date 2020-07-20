<template>
  <div id="tv_chart_container" />
</template>
<script type="text/jsx">
import DataFeeds from './TVChart/datafeed';
import { websocketOkex, unzip, filterPoint, filterDigit } from '@/utils/utils';
import { mapState } from 'vuex';
import numeral  from 'numeral';
const store= {
  ws: null,
  onDataCallback: null,
  onRealTimeCallback: null,
  to: null,
}
let lockReconnect = false;//避免重复连接
let tt = null;
let webscoketFlag = true;  // 判断是否为合约页面
let tv = null;
let timer = null;

export default {
  name: 'TradingView',
  components: {
  },
  props: ['curIndex'],
  data() {
    return {
    };
  },
  computed: {
    ...mapState(['contractList'])
  },
  watch: {
    curIndex: function(newVal) {
      if (parseFloat(this.contractList[newVal].okex)) {
        return;
      }
      this.createWidget()
    }
  },
  mounted() {
    if (parseFloat(this.contractList[this.curIndex].okex)) {
      return;
    }
    webscoketFlag = true;
    this.createWebSocket();
  },
  beforeDestroy() {
    webscoketFlag = false;
    if (store.ws) {
      store.ws.close === "function" && store.ws.close();
    }
  },
  methods: {
    createWebSocket() {
      store.ws = new WebSocket(websocketOkex);
      this.webpackinit();
    },
    reconnect() {
      const that = this;
      if(lockReconnect) {
        return;
      };
      lockReconnect = true;
      tt && clearTimeout(tt);
      tt = setTimeout(function () {
        that.createWebSocket();
        lockReconnect = false;
      }, 4000);
    },
    webpackinit() {
      const _this = this;
      store.ws.onmessage = e => {
        const _this = this;
        if(e.data instanceof Blob){
          let reader = new FileReader();
          reader.readAsBinaryString(e.data);
          reader.onload = function() {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
              if (store.ws && store.ws.readyState === 1) {
                store.ws.send('ping');
                if (unzip(this.result) !== 'pong') {
                  store.ws && typeof store.ws.close === "function" && store.ws.close();
                }
              }
            }, 3000)
            if (unzip(this.result) === 'pong') {
              return;
            }
            const { table, data, action } = JSON.parse(unzip(this.result));
            if (table && table.indexOf('depth') > -1) {
              if (Array.isArray(data)) {
                let depthAsks400 = {};
                let depthBids400 = {};
                if (action === 'partial') {
                  data[0].asks.map((item) => {
                    return depthAsks400[item[0]] = item[1]
                  });
                  sessionStorage.setItem('depthAsks400', JSON.stringify(depthAsks400));
                  data[0].bids.map((item) => {
                    return depthBids400[item[0]] = item[1]
                  });
                  sessionStorage.setItem('depthBids400', JSON.stringify(depthBids400));
                } else {
                  _this.setOkexDepth(data[0]);
                }
              }
            } else if (table && table.indexOf('candle') > -1) {
              store.onRealTimeCallback({
                time: new Date(data[0].candle[0]).getTime(),
                open: Number(data[0].candle[1]),
                close: Number(data[0].candle[4]),
                high: Number(data[0].candle[2]),
                low: Number(data[0].candle[3]),
                volume: Number(data[0].candle[5] * 1000),
              });
            }
          }
        }
      }
      this.createWidget(); // 存在websocket每次重连重载kline的bug
      store.ws.onclose = ()  => {
        if (webscoketFlag) {
          _this.reconnect()
        }
      };
      store.ws.onerror = () => {
        _this.reconnect()
      }
    },
    setOkexDepth(datas) {
      if (datas) {
        // ask是卖价, bids是买
        let depthAsks400 = JSON.parse(sessionStorage.getItem('depthAsks400'));
        let depthBids400 = JSON.parse(sessionStorage.getItem('depthBids400'));
        if (!depthAsks400 || !depthBids400) {
          return;
        }
        datas.asks.forEach((element) => {
          if (depthAsks400.hasOwnProperty(element[0])) {
            if (parseFloat(element[1]) === 0) {
              delete depthAsks400[element[0]];
            } else if (numeral(element[1])._value !== numeral(depthAsks400[element[0]])._value) {
              depthAsks400[element[0]] = element[1];
            }
          } else {
            depthAsks400[element[0]] = element[1];
          }
        })
        sessionStorage.setItem('depthAsks400', JSON.stringify(depthAsks400));

        datas.bids.forEach((element) => {
          if (depthBids400.hasOwnProperty(element[0])) {
            if (parseFloat(element[1]) === 0) {
              delete depthBids400[element[0]];
            } else if (numeral(element[1])._value !== numeral(depthBids400[element[0]])._value) {
              depthBids400[element[0]] = element[1];
            }
          } else {
            depthBids400[element[0]] = element[1];
          }
        })
        sessionStorage.setItem('depthBids400', JSON.stringify(depthBids400));

        const depthListAsksObj = {};
        Object.keys(depthAsks400).sort((a, b) => a - b).slice(0, 60).forEach(function(key) {
          depthListAsksObj[key] = depthAsks400[key];
        });
        let depthListAsks = []
        for (let i in depthListAsksObj) {
          depthListAsks.push({
            price: this.curIndex === 2 ? filterPoint(i, filterDigit(this.contractList[this.curIndex].contName)) : filterPoint(i, filterDigit(this.contractList[this.curIndex].contName)),
            amount: numeral(depthListAsksObj[i])._value * Math.floor(Math.random() * 50 + 50),
          })
        }
        depthListAsks = depthListAsks.sort((a, b) => b.price - a.price).filter(element => element.amount > 0).slice(-20).reverse();


        const depthListBidsObj = {};
        Object.keys(depthBids400).sort((a, b) => b - a).slice(0, 60).forEach(function(key) {
          depthListBidsObj[key] = depthBids400[key];
        });

        let depthListBids = []
        for (let i in depthListBidsObj) {
          depthListBids.push({
            price: this.curIndex === 2 ? filterPoint(i, filterDigit(this.contractList[this.curIndex].contName)) : filterPoint(i, filterDigit(this.contractList[this.curIndex].contName)),
            amount: numeral(depthListBidsObj[i])._value * Math.floor(Math.random() * 50 + 50),
          })
        }
        depthListBids = depthListBids.sort((a, b) => b.price - a.price).filter(element => element.amount > 0).slice(0, 20);
        depthListBids.forEach((item, index) => {
          item.percent = numeral(numeral(item.amount)._value / (numeral(item.amount)._value + numeral(depthListAsks[index].amount)._value)).format('0%');
          depthListAsks[index].percent = numeral(1 - numeral(item.percent)._value).format('0%');
        })

        sessionStorage.setItem('depthListAsks', JSON.stringify(depthListAsks));
        sessionStorage.setItem('depthListBids', JSON.stringify(depthListBids));
      }
    },
    createWidget() {
      tv = new TradingView.widget({
        debug: false,
        symbol: this.contractList[this.curIndex].okex,
        timezone: "Asia/Shanghai",
        fullscreen: false,
        interval: '5',
        container_id: "tv_chart_container",
        library_path: "/static/charting_library/",
        locale: "zh",
        height: '440px',
        width: '100%',
        toolbar_bg: '#060C30',
        autosize: false,
        datafeed: new DataFeeds(store),
        theme: "Dark",
        favorites: {
          intervals: ['1', '5', '15', '30', '60', '240', '360', '720', '1D', '1W']
        },
        customFormatters: {
          timeFormatter: {
            format: (date) => {
              var _format_str = '%h:%m';
              return _format_str.replace('%h', this.toDouble(date.getUTCHours()), 2).replace('%m', this.toDouble(date.getUTCMinutes()), 2).replace('%s', date.getUTCSeconds(), 2);
            }
          },
          dateFormatter: {
            format: (date) => {
              return date.getUTCFullYear() + '-' + this.toDouble(date.getUTCMonth() + 1) + '-' + this.toDouble(date.getUTCDate());
            }
          }
        },
        disabled_features: [ //禁用功能
          'header_symbol_search',
          'symbol_search_hot_key',
          'header_compare',
          'header_undo_redo',
          'header_screenshot',
          'volume_force_overlay',
          'widget_logo',
          'timeframes_toolbar', // 下面的时间
          'left_toolbar',
          'header_settings', // 设置
          'header_fullscreen_button', // 全屏按钮
          'header_indicators', // 指标
          'header_chart_type',
          'edit_buttons_in_legend',
          'source_selection_markers',
          'border_around_the_chart'
        ],
        enabled_features: [ //启用的功能
          "dont_show_boolean_study_arguments", //是否隐藏指标参数
          "hide_last_na_study_output", //隐藏最后一次指标输出
          "same_data_requery",
          "side_toolbar_in_fullscreen_mode",
          'adaptive_logo',
          "paneProperties.legendProperties.showLegend",
        ],
        overrides: {
          "paneProperties.background": "#060C30",
          "paneProperties.legendProperties.showLegend": true, // 隐藏左上角标题
          "volumePaneSize": "medium", // 支持的值: large, medium, small, tiny
        }
      });

      tv.onChartReady(() => {
        const chart = tv.chart();
        // 出现均线在0刻度，注意数据类型为number
        const colors = ["#ffffff", "#ff6d00", "#26c6da", "#fbc02d"];
        [7, 30].forEach((time, index) => {
          chart.createStudy("Moving Average", false, false, [time, 'close', 0], {
            'Plot.linewidth': 2,
            "plot.color.0": colors[index],
            "precision": 3
          });
        });
      });
    },
    toDouble(time) {
      if (String(time).length < 2) return "0" + time;
      return time
    }
  }
};
</script>

<style lang="less" scoped>
.wrap{
  padding-bottom: 90px;
  background-color: #060C30 !important;
  min-height: 667px;
}
.tabbar{
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  .type{
    font-size: 14px;
  }
  p{
    color: #c5cbce;
  }
  p img{
    margin-left: 6px;
    width: 12px;
    height: auto;
  }
}
.titles{
  padding-left: 12px;
  color: #c5cbce;
  font-size: 14px;
  height: 28px;
  line-height: 28px;
}
.btn_wrap{  
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  width: 100%;
  align-items: center;
  height: 80px;
  background-color: #060C30;
  .btn{
    margin: 0;
    height: 40px;
    width:  150px;
    line-height: 40px;
    &.red{
      background-color: #FF3A30;
    }
    &.green{
      background-color: #00D183;
    }
  }
}
</style>

