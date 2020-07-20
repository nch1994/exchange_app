
import { websocketODIN, websocketOkex, unzip, filterPoint, filterDigit } from "@/utils/utils";
import numeral from 'numeral'
import moment from 'moment';
class SelfWebSocket {
  constructor(symbol, interval) {
    const _this = this;
    this.symbol = symbol;
    this.interval = interval;
    this.ws = null;
    this.lockReconnect = false;
    this.tt = null;
    this.webscoketFlag = true;
    this.initWebpack()
    this.heartCheck = {
      timeout: 5000,//default 5s
      timeoutObj: null,
      serverTimeoutObj: null,
      reset:function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        clearTimeout(this.timeout)
        return this;
      },
      start:function(){
        const that = this;
        this.timeoutObj = setTimeout(function(){
          const msg = _this.symbol.indexOf('ODIN') > -1 ? `{"ping: ${moment().format('x')}"}` : 'ping';
          _this.ws.send(msg)
          that.serverTimeoutObj = setTimeout(function(){
            _this.ws.close();
          }, that.timeout)
        }, this.timeout)
      }
    }
  }
  initWebpack() {
    const websocketUrl = this.symbol.indexOf('ODIN') > -1 ? websocketODIN : websocketOkex;
    this.ws = new WebSocket(websocketUrl);
    this.ws.onopen = () => {
      this.open();
    }
    this.ws.onclose = ()  => {
      if (this.ws.readyState === 1) {
        if (this.symbol.indexOf('ODIN') > -1) {
          let granularity = ''
          if (this.interval <= 1800) {
            granularity = this.interval / 60 + 'm';
          } else if (1800 < this.interval && this.interval <= 43200) {
            granularity = this.interval / 60 / 60 + 'h'
          } else if (this.interval === 86400 ) {
            granularity = '1d';
          } else if (this.interval === 604800) {
            granularity = '1w';
          }
          const subscribeCandleData = `{"id":"kline_ODINUSDT${granularity}","topic":"kline_${granularity}","event":"cancel","symbol":"ODINUSDT","params":{"binary":false,"klineType":"${granularity}"}}`;
          const subscribeDepthData = '{"symbol": "ODINUSDT","topic": "depth","event": "cancel"}';
          this.ws.send(subscribeDepthData);
          this.ws.send(subscribeCandleData);
        } else {
          const subscribeData = `{"op": "unsubscribe", "args": ["swap/candle${this.interval}s:${this.symbol}", "swap/depth:${this.symbol}"]}`;
          this.ws.send(subscribeData);
        }
      }
      if (this.webscoketFlag) {
        this.reconnect()
      } else {
        clearTimeout(this.heartCheck.timeoutObj);
        clearTimeout(this.heartCheck.serverTimeoutObj);
        clearTimeout(this.heartCheck.timeout)
      }
    };
    this.ws.onerror = () => {
      this.reconnect()
    }
  }
  open() {
    if (this.symbol.indexOf('ODIN') > -1) {
      let granularity = ''
      if (this.interval <= 1800) {
        granularity = this.interval / 60 + 'm';
      } else if (1800 < this.interval && this.interval <= 43200) {
        granularity = this.interval / 60 / 60 + 'h'
      } else if (this.interval === 86400 ) {
        granularity = '1d';
      } else if (this.interval === 604800) {
        granularity = '1w';
      }
      const subscribeCandleData = `{"id":"kline_ODINUSDT${granularity}","topic":"kline_${granularity}","event":"sub","symbol":"ODINUSDT","params":{"binary":false,"klineType":"${granularity}"}}`;
      const subscribeDepthData = '{"symbol": "ODINUSDT","topic": "depth","event": "sub"}';
      this.ws.send(subscribeDepthData);
      this.ws.send(subscribeCandleData);
    } else {
      const subscribeData = `{"op": "subscribe", "args": ["swap/candle${this.interval}s:${this.symbol}", "swap/depth:${this.symbol}"]}`;
      this.ws.send(subscribeData);
    }
    this.heartCheck.reset().start();
  }
  reconnect() {
    if(this.lockReconnect) {
      return;
    };
    const _this = this;
    this.lockReconnect = true;
    this.tt && clearTimeout(this.tt);
    this.tt = setTimeout(function () {
      _this.initWebpack();
      _this.lockReconnect = false;
    }, 4000);
  }
  
  onMessage(callback) {
    this.ws.onmessage = e => {
      if (this.symbol.indexOf('ODIN') > -1) {
        const { data, topic } = JSON.parse(e.data);
        if (topic && topic.indexOf('depth') > -1) {
          const depthListAsksObj = data[0].a.sort().slice(0, 20);
          const depthListBidsObj = data[0].b.sort().slice(-20);
          let depthListAsks = []
          depthListAsksObj.forEach((element) => {
            depthListAsks.push({
              price: filterPoint(element[0], filterDigit('ODIN')),
              amount: Math.floor(Number(element[1]) * 500)
            })
          })
          let depthListBids = []
          depthListBidsObj.forEach((element) =>{
            depthListBids.push({
              price: filterPoint(element[0], filterDigit('ODIN')),
              amount: Math.floor(Number(element[1]) * 500)
            })
          })
          sessionStorage.setItem('depthListAsks', JSON.stringify(depthListAsks));
          sessionStorage.setItem('depthListBids', JSON.stringify(depthListBids));
          
        } else if (topic && topic.indexOf('kline') > -1) {
          callback(data)
        }
      } else {
        const _this = this;
        if(e.data instanceof Blob){
          let reader = new FileReader();
          reader.readAsBinaryString(e.data);
          reader.onload = function() {
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
              callback(data)
            }
          }
        }
      }
      this.heartCheck.reset().start();
    };
  }

  detory() {
    this.webscoketFlag = false;
    this.ws.close();
  }
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
          price: this.curIndex === 2 ? filterPoint(i, filterDigit(this.symbol)) : filterPoint(i, filterDigit(this.symbol)),
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
          price: this.curIndex === 2 ? filterPoint(i, filterDigit(this.symbol)) : filterPoint(i, filterDigit(this.symbol)),
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
  }
}

export default SelfWebSocket;