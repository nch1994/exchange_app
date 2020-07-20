<template>
  <div id="app" v-if="contractList.length > 1">
    <RouterView v-wechat-title="$route.meta.title" />
    <loading v-show="loading" />
    <!-- <button class="btn2" @click="changeLang">EN/CN</button> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Loading from '@/components/loading';
import { baseUrl, filterPoint, filterDigit, removeCookie, getCookie } from '@/utils/utils';
import store from "store";
let coinPriceSource, coinPriceSourceTimer = null;
import numeral from 'numeral'
export default {
  name: 'App',
  components: {
    Loading
  },
  computed: {
    ...mapState(['loading', 'contractList'])
  },
  mounted() {
    this.getCoinsSource();
  },
  destroyed() {
    if (coinPriceSource) {coinPriceSource.close(); clearTimeout(coinPriceSourceTimer)}
  },
  methods: {
    getCoinsSource() {
      const _this = this;
      coinPriceSource = new EventSource(`${baseUrl}sse/coinPrices`);
      coinPriceSource.onmessage = function (event) {
        const userId = getCookie('userId') || '';
        if (userId !== '') {
          removeCookie('userId');
          _this.$router.go(0)
        }
        const obj = JSON.parse(event.data);
        obj.forEach((element) => {
          element.rate = (numeral(element.rate).format('0.00%') || '0.00%')
          element.price = filterPoint(element.price, filterDigit(element.contName))
        })
        store.commit('contractList', obj)
      };
      coinPriceSource.onerror = function (err) {
        if (err.currentTarget.readyState === 2) {
          coinPriceSourceTimer = setTimeout(() => {
            _this.getCoinsSource();
            clearTimeout(coinPriceSourceTimer);
          }, 3000)
        }
      }
    },
    changeLang() {
      if (this.$i18n.locale === 'zh' ) {
        this.$i18n.locale = 'en';//关键语句
        localStorage.setItem('lang', 'en');
      }else {
        this.$i18n.locale = 'zh';//关键语句
        localStorage.setItem('lang', 'zh');
      }
    }
  }
};
</script>

import './common/font/font.css';
<style lang="less">
.btn2{
  width: 80px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  text-align: center;
  position: fixed;
  color: #ffffff;
  background-color: #007AFF;
  bottom: 100px;
  right: 0;
  border-radius: 10px 0 0 10px;
  z-index: 100;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  background-color: #ffffff;
}
.content{
  background-image: linear-gradient(to bottom, #FBFDFF, #F6FAFD);
  height: 100%;
  min-height: 667px;
  font-family: 'Regular';
}
.tabbar{
  display: flex;
  justify-content: space-between;
  padding-left: 18px;
  padding-right: 18px;
  height: 45px;
  align-items: center;
  .back{
    width: 16px;
    height: 11px;
  }
}
.title{
  color: #24324C;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  font-family: 'Semibold';
}
.btn{
  display: block;
  width: 330px;
  height: 47px;
  text-align: center;
  line-height: 47px;
  background-color: #007AFF;
  border-radius: 4px;
  color: #ffffff;
  margin: 72px auto 20px;
  font-size: 16px;
}
::-webkit-input-placeholder { /* WebKit browsers */
  color: #A6AEBB;
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
  color: #A6AEBB;
}

:-ms-input-placeholder { /* Internet Explorer 10+ */
  color: #A6AEBB;
}
</style>
