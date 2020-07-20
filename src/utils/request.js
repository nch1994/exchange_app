import axios from 'axios';
import store from "store";
import { Toast } from 'vant';
const whiteApi = ['btc/price', 'btc/kline'];
const baseURL = 'https://api.starqueen.top/api/v1/';
const request = axios.create({
  baseURL,
  timeout: 10000,
  retry: 4,
  retryDelay: 1000,
});


request.interceptors.request.use(function (config) {
  config.cancelToken = new axios.CancelToken((cancel) => {
    store.commit('pushToken', {
      cancelToken: cancel
    })
  })
  return config;
}, function (error) {
  return Promise.reject(error);
});

request.interceptors.response.use(function ({data}) {
  return data
}, function (err) {
  if (err.message === 'interrupt') {
    return
  }
  var config = err.config;
  const formartUrl = err.config.url.split('?')[0] || '';
  const iswhiteUrl = whiteApi.find((item) => {
    return formartUrl.endsWith(item);
  });
  if (config.method === 'get' || iswhiteUrl) {
    if(!config || !config.retry) return Promise.reject(err);
    config.__retryCount = config.__retryCount || 0;
    if(config.__retryCount >= config.retry) {
      return Promise.reject(err);
    }
    config.__retryCount += 1;
    var backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, config.retryDelay || 1);
    });
    return backoff.then(function() {
      return request(config);
    });
  } else if (config.method === 'post') {
    store.commit('hideLoading');
    const lang = localStorage.getItem('lang') || 'zh';
    if (lang === 'en') {
      Toast('Please try again later.');
    } else if (lang === 'zh') {
      Toast('请稍候重试');
    }
    return false;
  }
})

export default request;
