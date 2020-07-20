<template>
  <div class="wrap">
    <div class="tabbar">
      <img src="@/static/img/back2.png" alt="" class="back" @click="back('goHome')">
      <p @click="isShowList = true"><span class="type">{{ contractList[curIndex].contName }}</span><img src="@/static/img/bottom2.png" alt=""></p>
      <span />
    </div>
    <div class="coins_wrap">
      <Coins :curIndex="curIndex" />
    </div>
    <div>
      <div v-if="parseFloat(contractList[curIndex].okex)">
        <iframe width="100%" height="440px" frameborder="0" :src="udfUrl" />
      </div>
      <div v-else>
        <Tradingview :curIndex="curIndex" />
      </div>
    </div>
    <p class="titles">{{ $t('global.volume') }}</p>
    <div class="depth_wrap">
      <Depth :curIndex="curIndex" />
    </div>
    <div class="btn_wrap">
      <button class="green btn" @click="toContract(contractList[curIndex].contName)">{{ $t('global.buy') }}</button>
      <button class="red btn" @click="toContract(contractList[curIndex].contName)">{{ $t('global.sale') }}</button>
    </div>
    <van-popup v-model="isShowList" position="left" :style="{ width: '70%', height: '100%' }">
      <AccountList :curIdx="curIndex" @confirm="changeIdx" @cancel="isShowList = false" />
    </van-popup>
  </div>
</template>
<script type="text/jsx">
import Depth from './depth';
import AccountList from '@/components/leftList.vue';
import Coins from './coins';
import { mapState } from 'vuex';
import axios from 'axios';
import numeral from 'numeral';
import { filterPoint, filterDigit } from '@/utils/utils';
import Tradingview from './trading';
let timerODINDepth = null;
export default {
  name: 'Trading',
  components: {
    Depth,
    AccountList,
    Coins,
    Tradingview
  },
  data() {
    return {
      type: '',
      curIndex: 0,
      isShowList: false,
      udfUrl: ''
    };
  },
  computed: {
    ...mapState(['contractList'])
  },
  watch: {
  },
  mounted() {
    if (timerODINDepth) clearTimeout(timerODINDepth)
    const index = this.contractList.findIndex((item) => {
      return this.$route.query.name === item.contName;
    })
    this.curIndex = index < 0 ? 3 : index;
    if (parseFloat(this.contractList[this.curIndex].okex)) {
      this.udfUrl = `https://h5.starqueen.top/odin/index.html?name=${this.contractList[this.curIndex].okex}`;
      this.getOdinDepth();
    }
  },
  beforeDestroy() {
    clearTimeout(timerODINDepth)
  },
  methods: {
    changeIdx(index) {
      this.curIndex = index;
      this.isShowList = false;
      if (parseFloat(this.contractList[this.curIndex].okex)) {
        clearTimeout(timerODINDepth);
        this.getOdinDepth();
        this.udfUrl = `https://h5.starqueen.top/odin/index.html?name=${this.contractList[this.curIndex].okex}`
      }
    },
    getOdinDepth() {
      if (timerODINDepth) clearTimeout(timerODINDepth);
      if (parseFloat(this.contractList[this.curIndex].okex)) {
        axios({
          url: `https://tinance.pro/appApi.json?action=depth&symbol=${this.contractList[this.curIndex].okex}&size=20`,
          method: 'get',
        }).then(res => {
          if (res.status === 200) {
            const { data } = res.data;
            let minLength = Math.min(data.asks.length, data.bids.length);
            minLength = minLength > 20 ? 20 : minLength;
            const depthListAsksObj = data.asks.sort().slice(0, minLength);
            const depthListBidsObj = data.bids.sort().slice(-1 * minLength).reverse();
            let depthListAsks = []
            depthListAsksObj.forEach((element) => {
              if (this.contractList[this.curIndex].contName.indexOf('BTC') > -1 ) {
                element[1] = Number(element[1]) * 89898
              }
              if (this.contractList[this.curIndex].contName.indexOf('ETH') > -1) {
                element[1] = Number(element[1]) * 50003
              }
              depthListAsks.push({
                price: filterPoint(element[0], filterDigit(this.contractList[this.curIndex].contName)),
                amount: Math.floor(Number(element[1]))
              })
            })
            let depthListBids = []
            depthListBidsObj.forEach((element) =>{
              if (this.contractList[this.curIndex].contName.indexOf('BTC') > -1 ) {
                element[1] = Number(element[1]) * 89898
              }
              if (this.contractList[this.curIndex].contName.indexOf('ETH') > -1) {
                element[1] = Number(element[1]) * 50003
              }
              depthListBids.push({
                price: filterPoint(element[0], filterDigit(this.contractList[this.curIndex].contName)),
                amount: Math.floor(Number(element[1]))
              })
            })
            const depthAverageArr = [depthListAsks.slice(-1)[0] ? depthListAsks.slice(-1)[0].price : 0, depthListBids[0] ? depthListBids[0].price : 0];
            let depthPrice = '--';
            if (depthAverageArr.indexOf(0) > -1) {
              depthPrice = depthAverageArr.indexOf(0) === 0 ? depthAverageArr[1] : depthAverageArr[0];
            } else {
              var rand = Math.floor( Math.random() * depthAverageArr.length);
              depthPrice = depthAverageArr[rand];
            }
            depthListBids.forEach((item, index) => {
              item.percent = numeral(numeral(item.amount)._value / (numeral(item.amount)._value + numeral(depthListAsks[index].amount)._value)).format('0%');
              depthListAsks[index].percent = numeral(1 - numeral(item.percent)._value).format('0%');
            })
            sessionStorage.setItem('depthPrice', depthPrice);
            sessionStorage.setItem('depthListAsks', JSON.stringify(depthListAsks));
            sessionStorage.setItem('depthListBids', JSON.stringify(depthListBids));
            timerODINDepth = setTimeout(() => {
              this.getOdinDepth()
            }, 1000)
          }
        })
      }
    },
    back(str) {
      if (this.$route.query.type === 'Android') {
        androidK.closeWindow();
      } else if (this.$route.query.type === 'ios') {
        try {
          closeWindow(str);
        } catch (error) {
          console.error(error)
        }
      } else {
        this.$router.replace('/');
      }
    },
    closeWindow(str) {
      window.webkit.messageHandlers.closeWindow.postMessage(str);
    },
    toContract(okex) {
      if (this.$route.query.type === 'Android') {
        androidK.skipContract(okex);
      } else if (this.$route.query.type === 'ios') {
        try {
          skipContract(okex);
        } catch (error) {
          console.error(error)
        }
      } else {
        this.$router.push({path: '/contract', query: { name: this.contractList[this.curIndex].contName }});
      }
    },
    skipContract(okex) {
      window.webkit.messageHandlers.skipContract.postMessage(okex);
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

