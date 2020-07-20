<template>
  <div class="content">
    <div class="titles">
      <span />
      <span class="ask_wrap" @click="isShowAsk = true">{{ $t('option.title') }}<img src="@/static/img/ask.png"></span>
      <router-link :to="{path: `/option/record/${contName}`}" class="imgs">
        <img src="@/static/img/asset/record.png" alt="">
      </router-link>
    </div>
    <div class="top">
      <div class="top_left">
        <div class="option_item" @click="isShowOptionList = true">
          <img :src="optionList[optionIdx].icon" alt="">
          <p><span>{{ optionList[optionIdx].contName }}<img class="bottom" src="@/static/img/bottom.png"></span><span>{{ $t('option.guess') }}</span></p>
        </div>
        <ul class="time_item"><li v-for="(item, index) in timeList" :class="timeIdx === index ? 'active' : '' " :key="index" @click="changeTimeIdx(index)">{{ item.time }}min</li></ul>
      </div>
    </div>
    <div class="chart" v-if="optionList[optionIdx]">
      <div class="chart_title">
        <img @click="changeChartIdx(0)" :src="chartIdx === 0 ? soptionIcon01 : optionIcon01" alt="">
        <img @click="changeChartIdx(1)" :src="chartIdx === 1 ? soptionIcon02 : optionIcon02" alt="">
      </div>
      <div class="chart_info">
        <div class="chart_info1" v-show="chartIdx === 0"><AreaChart :okex="optionList[optionIdx].okex" /></div>
        <div class="chart_info2" v-show="chartIdx === 1"><KlineChart :okex="optionList[optionIdx].okex" /></div>
      </div>
    </div>
    <div class="btn_wrap">
      <button class="up" @click="showOprate(1)">{{ $t('contract.index.rose') }}<img src="@/static/img/contract/up.png" alt=""></button>
      <button class="down" @click="showOprate(0)">{{ $t('contract.index.fall') }}<img src="@/static/img/contract/down.png" alt=""></button>
    </div>
    <p class="title">{{ $t('option.currentCang') }}</p>
    <div v-if="list.length > 0">
      <van-list :finished="finished" v-model="loading" :finished-text="$t('global.noMore')" @load="getRecord" :immediate-check="false">
        <ul class="lists">
          <li v-for="(item, index) in list" :key="index" class="list">
            <p>{{ $t('option.subTitle') }}{{ item.recType === 1 ? $t('contract.index.rose') : $t('contract.index.fall') }}
              <img v-if="item.recType === 1" src="@/static/img/contract/up1.png" alt="">
              <img v-else src="@/static/img/contract/down1.png" alt="">
            </p>
            <p>{{ item.guessName }}*{{ item.cycle }}min <span>{{ item.createTime }}</span></p>
            <CountDown class="countDown" :target="item.countDown" />
            <ul class="list_info">
              <li><p>{{ $t('option.openPrice') }}</p><p>{{ item.openPrice }}</p></li>
              <li><p>{{ $t('option.cycle') }}</p><p>{{ item.startTime }}:00~{{ item.endTime }}:59</p></li>
              <li><p>{{ $t('global.amount') }}</p><p>{{ item.sheet }}</p></li>
            </ul>
          </li>
        </ul>
      </van-list>
    </div>
    <div v-else>
      <Empty />
    </div>
    <van-popup v-model="isShowOprate" class="showLayer" position="bottom" :style="{ width: '100%', height: '50%' }">
      <Oprate :addTime1="addTime1" :addTime2="addTime2" :optionList="optionList" :optionIdx="optionIdx" :timeList="timeList" :timeIdx="timeIdx" :maxSheet="maxSheet" :serviceCharge="serviceCharge" :type="type" @addEntrust="addEntrust($event)" @closeOprate="isShowOprate = false" />
    </van-popup>
    <van-popup v-model="isShowOptionList" position="left" :style="{ width: '70%', height: '100%' }">
      <OptionListCom :curIdx="optionIdx" :list="optionList" @confirm="changeOptionIdx($event)" @cancel="isShowOptionList = false" />
    </van-popup>
    <van-overlay :show="isShowAsk" @click="isShowAsk = false">
      <div class="ask_wrapper" @click="isShowAsk = false">
        <div class="ask_info">
          <p>{{ $t('option.ruleTitle') }}</p>
          <ul>
            <li v-for="(item, index) in $t('option.rules')" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { decryptByDES, getCookie, filterPoint } from '@/utils/utils';
import Oprate from './oprate'
import moment from 'moment';
import CountDown from './countDown';
import OptionListCom from '@/components/optionList';
import Empty from '@/components/empty';
import AreaChart from './areaChart';
import KlineChart from './klineChart';
import numeral from 'numeral';
const optionIcon01 = require('@/static/img/optionIcon01.png');
const soptionIcon01 = require('@/static/img/soptionIcon01.png');
const optionIcon02 = require('@/static/img/optionIcon02.png');
const soptionIcon02 = require('@/static/img/soptionIcon02.png');
let timer3 = null;
export default {
  name: 'Index',
  components: {
    Oprate,
    CountDown,
    OptionListCom,
    Empty,
    AreaChart,
    KlineChart,
  },
  data () {
    return {
      isShowOptionList: false,
      optionList: [{
        icon: '',
        contName: '',
        coinName: ''
      }],
      userId: '',
      optionIdx: 0,
      pageNum: 1,
      timeList: [{
        time: 1,
        eth: 0.1,
        usdt: 10
      }, {
        time: 3,
        eth: 0.5,
        usdt: 50
      }, {
        time: 5,
        eth: 1,
        usdt: 100
      }],
      timeIdx: 0,
      balance: '',
      isShowOprate: false,
      maxSheet: 0,
      addTime1: '00',
      addTime2: '00',
      serviceCharge: 0,
      type: 1,
      list: [],
      finished: false,
      contName: 'BTC',
      loading: false,
      isShowAsk: false,
      chartIdx: 0,
      optionIcon01,
      soptionIcon01,
      optionIcon02,
      soptionIcon02
    }
  },
  watch: {
  },
  mounted() {
    this.userId = decryptByDES(getCookie('token'));
    this.guessContract().then((res) => {
      res.forEach((element) => {
        element.coinName = element.coinName.split('(')[0];
      })
      this.optionList = res;
      this.contName = res[this.optionIdx].contName;
      this.list = [];
      this.pageNum = 1;
      this.getRecord();
      if (this.userId !== '') {
        this.getGuessAccount();
        this.getAssetAccount();
      }
    })
  },
  beforeDestroy() {
    if (timer3) clearInterval(timer3)
  },
  methods: {
    ...mapActions(['guessContract', 'guessEntrust', 'guessAccount', 'addGuessEntrust', 'getAccount']),
    showOprate(type) {
      if (this.userId === '') {
        this.$router.push('/login');
      } else if (this.optionList[this.optionIdx].contSwitch === 0) {
        this.$toast(this.$t('global.notopen'));
      } else {
        this.type = type;
        this.isShowOprate = true;
      }
    },
    changeChartIdx(index) {
      this.chartIdx = index;
    },
    changeOptionIdx(index) {
      this.isShowOptionList = false;
      this.optionIdx = index;
      this.serviceCharge = this.optionList[index].serviceCharge;
      this.pageNum = 1;
      this.list = [];
      this.getGuessAccount();
      this.getRecord();
    },
    changeTimeIdx(index) {
      this.timeIdx = index;
      this.getGuessAccount();
    },
    getAssetAccount() {
      const accountData = {
        coinType: 1,
        userId: decryptByDES(getCookie('token'))
      };
      this.getAccount(accountData).then((obj) => {
        obj.accountDetails.forEach((element) => {
          element.amount = filterPoint(element.amount ? element.amount : 0, 8);
          element.freezeAmount = filterPoint(element.freezeAmount ? element.freezeAmount : 0, 8);
          element.cny = filterPoint(element.cny, 2);
        });
        obj.contractAccounts.forEach((element) => {
          element.balance = filterPoint(element.balance, 4);
          element.settle = filterPoint(element.settle, 4);
          element.profit = filterPoint(element.profit, 4);
          element.bondRate = numeral(element.bondRate).format('0.00%');
        });
        localStorage.setItem('accountDetails', JSON.stringify(obj.accountDetails));
        localStorage.setItem('contractAccounts', JSON.stringify(obj.contractAccounts));
        localStorage.setItem('coinContracts', JSON.stringify(obj.coinContracts));
      })
    },
    getRecord() {
      if (this.userId === '') return;
      this.finished = false;
      this.loading = true;
      const data = `userId=${this.userId}&guessId=${this.optionList[this.optionIdx].contId}&types=1&pageNum=${this.pageNum}&pageSize=20`;
      this.guessEntrust(data).then((res) => {
        this.finished = res.isLastPage;
        this.pageNum = this.pageNum + 1;
        this.loading = false;
        res.list.forEach((element) => {
          element.openPrice = filterPoint(element.openPrice, 1);
          element.startTime = moment(Date.parse(new Date(element.createTime))).add(2, 'minutes').format('HH:mm');
          element.endTime = moment(Date.parse(new Date(element.settleTime))).subtract(1, 'minutes').format('HH:mm');
          element.createTime = moment(element.createTime).format('HH:mm MM/DD');
          element.countDown = element.countDown || 0;
        });
        this.list = res.list;
      })
    },
    addEntrust(sheet) {
      const data = {
        cycle: this.timeList[this.timeIdx].time,
        guessId: this.optionList[this.optionIdx].contId,
        ratio: 10,
        recType: this.type,
        sheet,
        userId: this.userId
      }
      this.addGuessEntrust(data).then((msg) => {
        this.$toast(msg);
        this.list = [];
        this.pageNum = 1;
        this.getRecord();
        this.getGuessAccount();
        this.isShowOprate = false;
      }).catch((msg) => {
        this.$toast(msg);
      })
    },
    getGuessAccount() {
      if (this.userId === '') return;
      if (timer3) { clearInterval(timer3) }
      this.guessAccount(`${this.userId}/${this.optionList[this.optionIdx].contId}`).then((res) => {
        this.balance = res.balance;
        const sheetValue = this.optionList[this.optionIdx].coinName === 'USDT' ? this.timeList[this.timeIdx].usdt : this.timeList[this.timeIdx].eth;
        const maxSheet = Math.floor(res.balance / (parseFloat(sheetValue) * (1 + this.optionList[this.optionIdx].serviceCharge)));
        this.maxSheet = maxSheet > 10 ? 10 : maxSheet;
        this.addTime1 = moment(new Date(res.timestamp)).add(2, 'minutes').format('HH:mm');
        this.addTime2 = moment(new Date(res.timestamp)).add(this.timeList[this.timeIdx].time + 2, 'minutes').format('HH:mm');
        this.serviceCharge = this.optionList[this.optionIdx].serviceCharge;
        let timestamp = res.timestamp;
        timer3 = setInterval(() => {
          timestamp = timestamp + 1000;
          const currentSeconds = new Date(timestamp).getSeconds();
          if (currentSeconds === 2) {
            this.addTime1 = moment(new Date(timestamp)).add(2, 'minutes').format('HH:mm');
            this.addTime2 = moment(new Date(timestamp)).add(this.timeList[this.timeIdx].time + 2, 'minutes').format('HH:mm');
            this.list = [];
            this.pageNum = 1;
            this.getGuessAccount();
            this.getRecord();
          }
        }, 1000)
      })
    },
  },
}
</script>
<style lang="less" scoped>
.van-list{
  padding-bottom: 45px;
}
.titles{
  display: flex;
  justify-content: space-between;
  height: 40px;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  .imgs{
    width: 20px;
    height: 20px;
    img{
      width: 100%;
    }
  }
}
.ask_wrap{
  display: flex;
  align-items: center;
  img{
    width: 15px;
    margin-left: 4px;
  }
}
.ask_wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    height: 100%;
    width: 340px;
    p{
      padding-left: 12px;
      line-height: 40px;
      height: 40px;
      font-size: 16px;
    }
    ul{
      li{
        font-size: 13px;
        line-height: 22px;
      }
    }
  }
.ask_info{
  background-color: #ffffff;
  padding: 10px 12px 30px;
  border-radius: 10px;
}

.top{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 17px;
  padding-right: 17px;
  color: #24324C;
  padding-top: 12px;
  padding-bottom: 12px;
  font-size: 12px;
  .top_left{
    display: flex;
    .option_item{
      display: flex;
      margin-right: 12px;
      img {
        width: 24px;
        height: 24px;
        margin-right: 6px;
      }
      p{
        display: flex;
        flex-direction: column;
        font-size: 12px;
        .bottom{
          width: 13px;
          height: auto;
          margin-left: 6px;
        }
      }
    }
    .time_item{
      display: flex;
      padding-right: 8px;
      li{
        height: 14px;
        line-height: 14px;
        margin-right: 6px;
        padding: 4px 6px;
        border: solid 1px #24324C;
        color: #24324C;
        border-radius: 4px;
        font-size: 12px;
        &.active{
          color: #007AFF;
          border: solid 1px #007AFF;
        }
        &:nth-last-child(1) {
          margin-right: 0;
        }
      }
    }
  }
  .top_right{
    span{
      color: #007AFF;
    }
  }
}
.chart{
  height: 240px;
  width: 100%;
  margin: 16px auto;
  position: relative;
  .chart_title{
    position: absolute;
    top: 0;
    left: 50px;
    z-index: 100;
    img{
      width: 20px;
      margin-right: 10px;
    }
  }
  .chart_info{
    div{
      &.chart_info1, &.chart_info2{
        height: 240px;
      }
    }
  }
}
.btn_wrap{
  width: 340px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  button{
    width: 142px;
    height: 36px;
    color: #ffffff;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    img{
      width: 18px;
      margin-left: 4px;
    }
    &.up{
      background-color: #40ad7a;
    }
    &.down{
      background-color: #d74e5a;
    }
  }
}
.title{
  margin-left: 17px;
  margin-top: 8px;
  padding-left: 0;
  line-height: 28px;
  font-weight: normal;
  font-size: 14px;
  display: inline-block;
  border-bottom: solid 2px #007AFF;
}
.showLayer{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 375px;
  height: 400px;
}
.lists{
  width: 340px;
  margin: 10px auto 0;
  font-size: 12px;
  .list{
    border: solid 1px #e1e1e1;
    padding-left: 10px;
    padding-right: 10px;
    margin-bottom: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    .countDown{
      position: absolute;
      right: 10px;
      top: 10px;
      border: solid 1px #3e455180;
      color: #3e4551;
      padding: 2px 3px;
    }
    p{
      font-size: 14px;
      line-height: 24px;
      img{
        width: 16px;
        margin-left: 4px;
        vertical-align: middle;
      }
    }
  }
  .list_info{
    display: flex;
    justify-content: space-between;
    li{
      text-align: center;
      padding-top: 0;
      padding-bottom: 0;
      p{
        color: #3E4551;
        font-size: 14px;
        line-height: 20px;
        &:nth-child(1) {
          color: #B2B8C4;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
