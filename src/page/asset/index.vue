<template>
  <div class="content">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh(1)">
      <div class="tabbar">
        <img src="@/static/img/back.png" alt="" class="back" @click="back">
        <p class="title">{{ $t('asset.titles') }}</p>
        <span />
      </div>
      <div class="navtop">
        <ul class="">
          <li v-for="(item, index) in $t('asset.title')" :key="index" :class="curIndex === index ? 'active' : ''" @click="changeIdx(index)">{{item}}</li>
        </ul>
      </div>
      <div v-if="curIndex === 0">
        <curIndexLeft :accountDetails="accountDetails" :totalBTC="totalBTC" :totalCNY="totalCNY" />
      </div>
      <div v-if="curIndex === 1">
        <curIndexCenter :contractAccounts="contractAccounts" :contractBTC="contractBTC" :contractCNY="contractCNY" />
      </div>
      <div v-if="curIndex === 2">
        <curIndexRight :guessAccounts="guessAccountsInfo" :guessBTC="guessBTC" :guessCNY="guessCNY" />
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import curIndexLeft from './curIndex_left.vue'
import curIndexCenter from './curIndex_center.vue'
import curIndexRight from './curIndex_right.vue'
import { mapActions } from 'vuex';
import { getCookie, baseUrl, filterPoint, decryptByDES, filterOptionDigit } from '@/utils/utils';
import numeral from 'numeral'

let accountSource, accountSourceTimer = null;
export default {
  components: {
    curIndexLeft,
    curIndexCenter,
    curIndexRight
  },
  data () {
    return {
      curIndex: 0,
      accountDetails: [],
      totalBTC: 0,
      totalCNY: 0,
      contractBTC: 0,
      contractCNY: 0,
      isLoading: false,
      contractAccounts: [],
      guessBTC: 0,
      guessCNY: 0,
      guessAccountsInfo: [],
      userId: ''
    }
  },
  mounted() {
    this.curIndex = parseInt(sessionStorage.getItem('assetsIdx')) || 0;
    this.userId = decryptByDES(getCookie('token')) || '';
    this.onRefresh(0);
    this.getAccountSource();
    this.guessAccountFn();
  },
  destroyed() {
    if (accountSource) {accountSource.close(); clearTimeout(accountSourceTimer)}
  },
  methods: {
    ...mapActions(['getAccount', 'guessAccounts']),
    back () {
      this.$router.go(-1);
    },
    guessAccountFn() {
      this.guessAccounts(`${this.userId}`).then((res) => {
        this.guessBTC = filterPoint(res.guessBTC, 8);
        this.guessCNY = filterPoint(res.guessCNY, 2);
        res.guessAccounts.forEach((element) => {
          element.contName = element.contName.split('(')[0];
          element.balance = filterPoint(element.balance, filterOptionDigit(element.contName));
        })
        this.guessAccountsInfo = res.guessAccounts;
      })
    },
    onRefresh(type) {
      const accountData = {
        coinType: 1,
        userId: decryptByDES(getCookie('token'))
      };
      if (type === 1) {
        this.isLoading = true;
      }
      this.getAccount(accountData).then((obj) => {
        if (type === 1) {
          this.isLoading = false;
        }
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
        this.totalBTC = filterPoint(obj.totalBTC, 8);
        this.totalCNY = filterPoint(obj.totalCNY, 2);
        localStorage.setItem('accountDetails', JSON.stringify(obj.accountDetails));
        localStorage.setItem('contractAccounts', JSON.stringify(obj.contractAccounts));
        localStorage.setItem('coinContracts', JSON.stringify(obj.coinContracts));
        this.accountDetails = obj.accountDetails;
      })
    },
    changeIdx(index) {
      sessionStorage.setItem('assetsIdx', index);
      this.curIndex = index
    },
    getAccountSource() {
      const _this = this;
      accountSource = new EventSource(`${baseUrl}sse/getAccount?userId=${this.userId}&coinType=1`);
      accountSource.onmessage = function (event) {
        const obj = JSON.parse(event.data);
        obj.contractAccounts.forEach((element) => {
          element.balance = filterPoint(element.balance, 4);
          element.settle = filterPoint(element.settle, 4);
          element.profit = filterPoint(element.profit, 4);
          element.bondRate = numeral(element.bondRate).format('0.00%');
        });
        _this.contractBTC = filterPoint(obj.contractBTC, 4);
        _this.contractCNY = filterPoint(obj.contractCNY, 2);
        _this.contractAccounts = obj.contractAccounts;
      };
      accountSource.onerror = function (err) {
        if (err.currentTarget.readyState === 2) {
          accountSourceTimer = setTimeout(() => {
            _this.getAccountSource();
            clearTimeout(accountSourceTimer);
          }, 3000)
        }
      }
    },
  }
}
</script>
<style lang="less" scoped>
.content{
  padding-bottom: 60px;
}
.navtop{
  display: flex;
  justify-content: space-between;
  font-family: 'Semibold';
  height: 38px;
  align-items: center;
  ul{
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 18px;
    li{
      color: #24324C;
      font-size: 16px;
      height: 26px;
      line-height: 26px;
      border-bottom: solid 2px transparent;
      margin-right: 24px;
      &.active{
        border-bottom: solid 2px #007AFF;
        color: #007aff;
        font-size: 18px;
      }
    }
  }
  .navtop_right{
    padding-right: 17px;
    display: flex;
    justify-items: center;
    align-items: center;
    font-size: 12px;
    img{
      width: 18px;
      height: 18px;
      margin-right: 6px;
    }
  }
}

</style>
