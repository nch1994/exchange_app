// import SelfWebSocket from './ws';
import axios from 'axios';
import pako from 'pako';
import { baseUrl, filterDigit } from '@/utils/utils';

const getTimeRange = (resolution, to) => {
  let minutes = resolution;

  if (resolution.includes('D')) {
    if (resolution.length < 2) resolution = '1' + resolution;
    minutes = parseInt(resolution) * 24 * 60;
  } else if (resolution.includes('W')) {
    if (resolution.length < 2) resolution = '1' + resolution;
    minutes = parseInt(resolution) * 24 * 60 * 7 * 60;
  } else if (resolution.includes('M')) {
    if (resolution.length < 2) resolution = '1' + resolution;
    minutes = parseInt(resolution) * 24 * 60 * 30;
  }

  let from = null;
  if (to) {
    from = to - 200 * minutes * 60;
    if (resolution.includes('M') || resolution.includes('W')) { // 周线月线控制条数
      from = to - 50 * minutes * 60;
    }
  }

  return {
    minutes,
    from,
    to,
  };
};

const resolutionFormat = resolution => {
  if (resolution.includes('D')) {
    resolution = 1 * 24 * 60 * 60;
    return resolution;
  } else if (resolution.includes('W')) {
    resolution = 7 * 24 * 60 * 60;
    return resolution;
  }
  return resolution * 60;
};

class DataFeeds {
  constructor(store) {
    this.store = store;
    this.ws = store.ws;
    this.to = null;
  }

  onReady(callback) {
    const defaultConfiguration = {
      symbols_type: [],
      supported_resolutions: ['1', '5', '15', '30', '60', '240', '360', '720', '1D', '1W'],
      supports_marks: true,
      supports_timescale_marks: false,
      supports_time: false
    };
    setTimeout(() => {
      callback(defaultConfiguration);
    }, 0)
  }

  getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onDataCallback, onErrorCallback, firstDataRequest) {
    const obj = getTimeRange(resolution, firstDataRequest ? rangeEndDate : this.to);
    const granularity = resolutionFormat(resolution);
    this.to = obj.from;
    axios({
      url: `${baseUrl}/btc/kline?instrumentId=${symbolInfo.name}&granularity=${granularity}&start=${obj.from * 1000}&end=${obj.to * 1000}`,
      method: 'POST',
    }).then(res => {
      let data = [];
      if (res.status === 200) {
        res.data.obj = res.data.obj ? res.data.obj.reverse() : [];
        for ( let i of res.data.obj) {
          data.push({
            time: new Date(i[0]).getTime(),
            open: Number(i[1]),
            close: Number(i[4]),
            high: Number(i[2]),
            low: Number(i[3]),
            volume: Number(i[5]*1000),
          });
        }
        onDataCallback(data, { noData: !data.length });
      }
    });
  }

  subscribeBars (symbolInfo, resolution, onRealTimeCallback, listenerGUID, onResetCacheNeededCallback) {
    this.store.onRealTimeCallback = onRealTimeCallback;
    const subscribeData = `{"op": "subscribe", "args": ["swap/candle${resolutionFormat(resolution)}s:${symbolInfo.symbol}", "swap/depth:${symbolInfo.symbol}"]}`;
    if (this.ws.readyState === 1) {
      this.ws.send(subscribeData)
    }
  }

  unsubscribeBars(subscriberUID) {
    const symbolName = subscriberUID.split('_')[0];
    const symbolInterval = resolutionFormat(subscriberUID.split('_')[1]);
    const subscribeData = `{"op": "unsubscribe", "args": ["swap/candle${symbolInterval}s:${symbolName}", "swap/depth:${symbolName}"]}`;
    if (this.ws.readyState === 1) {
      this.ws.send(subscribeData)
    }
  }

  resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
    const newSymbol = Object.assign({}, {
      timezone: 'Asia/Shanghai',
      minmov: 1,
      minmov2: 0,
      pointvalue: 1,
      session: '24x7',
      has_seconds: false,
      has_daily: true,
      has_weekly_and_monthly: true,
      has_no_volume: false,
      has_empty_bars: true,
      description: '',
      has_intraday: true,
      supported_resolutions: ['1', '5', '15', '30', '60', '240', '360', '720', '1D', '1W'],
      pricescale: 100000000, //价格精度
      volume_precision: 3, //数量精度
    }, {
      symbol: symbolName,
      ticker: symbolName,
      name: symbolName,
      pricescale: Math.pow(10, filterDigit(symbolName)),
      volume_precision: 3 || 3
    });
    setTimeout(() => {
      onSymbolResolvedCallback(newSymbol);
    }, 0)
  }
  
}

export default DataFeeds;

function unzip(key) {
  var charData = key.split('').map(function (x) { return x.charCodeAt(0); });
  var binData = new Uint8Array(charData);
  var data = pako.inflateRaw(binData);
  key = String.fromCharCode.apply(null, new Uint16Array(data));
  return unescape(key);
}