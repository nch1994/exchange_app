<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('asset.transfer.title') }}</p>
      <span />
    </div>
    
    <div @click="isShowList = true" class="button" v-if="accountDetails.length > 0">
      <p>{{ accountDetails[curIndex].enName }}{{ $t('global.coin') }}</p>
      <p>{{ $t('global.chooseCoin') }}></p>
    </div>
    
    <div class="center" v-if="accountDetails.length > 0">
      <div v-if="coinContracts[curIndex].contractAccountList.length > 0">
        <div class="center_top">
          <div class="circle">
            <img src="@/static/img/asset/circle1.png" alt="">
            <img src="@/static/img/asset/circle.png" alt="">
            <img src="@/static/img/asset/circle.png" alt="">
            <img src="@/static/img/asset/circle.png" alt="">
            <img src="@/static/img/asset/circle2.png" alt="">
          </div>
          <div class="items">
            <div class="item">
              <span>{{ $t('asset.transfer.from') }}</span>
              <p v-show="transfer === 0">{{ $t('asset.transfer.wallet') }}</p>
              <p v-show="transfer === 1">{{coinContracts[curIndex].contractAccountList[accountIdx].contName}}{{ coinContracts[curIndex].contractAccountList[accountIdx].contId > 100 ? $t('global.option') : $t('global.perpetual') }}</p>
              <img v-show="transfer === 1 && coinContracts[curIndex].contractAccountList.length > 1" src="@/static/img/bottom.png" @click="showtransferAccount = true" alt="">
            </div>
            <div class="item">
              <span>{{ $t('asset.transfer.to') }}</span>
              <p v-show="transfer === 1">{{ $t('asset.transfer.wallet') }}</p>
              <p v-show="transfer === 0">{{coinContracts[curIndex].contractAccountList[accountIdx].contName}}{{ coinContracts[curIndex].contractAccountList[accountIdx].contId > 100 ? $t('global.option') : $t('global.perpetual') }}</p>
              <img v-show="transfer === 0 && coinContracts[curIndex].contractAccountList.length > 1" src="@/static/img/bottom.png" @click="showtransferAccount = true" alt="">
            </div>
          </div>
          <div class="action">
            <img src="@/static/img/asset/transfer.png" alt="" @click="transferIdx()">
          </div>
        </div>
        <div class="center_form">
          <div class="item">
            <label for="">{{ $t('asset.transfer.coin') }}</label>
            <input type="text" readonly :value="accountDetails[curIndex].enName">
          </div>
          <div class="item">
            <label for="">{{ $t('asset.transfer.count') }}</label>
            <input type="text" @input="changeCount()" v-model="amount" :placeholder="$t('asset.transfer.inputCount')">
            <span class="unit">{{ unit }}</span>
            <span class="all" @click="all">{{ $t('asset.transfer.all') }}</span>
          </div>
          <div class="form_notice">{{ $t('asset.withdraw.available') }} {{ useable }} {{ unit }}</div>
        </div>
        <div class="transfer_notice">
          <p>{{ $t('asset.transfer.notice') }}</p>
        </div>
        <button class="btn" @click="confirm">{{ $t('global.confirm') }}</button>
      </div>
      <div v-if="coinContracts[curIndex].contractAccountList.length === 0" class="switch_notice">{{ $t('notice.isClosed') }}</div>
    </div>

    <div v-show="showtransferAccount" v-if="coinContracts[curIndex]">
      <transferAccount :accountList="coinContracts[curIndex].contractAccountList" :accountIdx="accountIdx" @confirm="changeAccountIdx" @cancel="showtransferAccount = false" />
    </div>
    <van-popup v-model="isShowList" position="left" :style="{ width: '70%', height: '100%' }">
      <CoinList :curIdx="curIndex" :list="accountDetails" @confirm="changeCoinIdx" @cancel="isShowList = false" />
    </van-popup>
  </div>
  
</template>
<script>
import transferAccount from './transfer_account.vue';
import { getCookie, filterPoint, decryptByDES } from '@/utils/utils';
import numeral from 'numeral';
import { mapActions } from 'vuex';
import CoinList from '@/components/coinList.vue';

export default {
  name: 'AssetTransfer',
  components: {
    transferAccount,
    CoinList
  },
  data () {
    return {
      transfer: 0,
      showtransferAccount: false,
      accountIdx: 0,
      useable: 0,
      amount: '',
      isShowList: false,
      curIndex: 0,
      unit: 'USDT',
      accountDetails: [],
      coinContracts: []
    }
  },
  mounted () {
    this.transfer = Number(this.$route.params.transfer);
    this.accountDetails = JSON.parse(localStorage.getItem('accountDetails'));
    this.coinContracts = JSON.parse(localStorage.getItem('coinContracts'));
    const transferInfo = sessionStorage.getItem('transferInfo') ? JSON.parse(sessionStorage.getItem('transferInfo')) : {};
    let index = 0;
    let accountIdx = 0;
    index = this.accountDetails.findIndex((element) => {
      return parseInt(element.coinType) === parseInt(transferInfo.coinType) || 0
    })

    accountIdx = this.coinContracts[index].contractAccountList.findIndex((element) => {
      return parseInt(element.contId) === parseInt(transferInfo.contId) || 0
    })

    this.curIndex = index > -1 ? index : 0;
    this.accountIdx = accountIdx > -1 ? accountIdx : 0;
    const point = parseInt(this.transfer) === 0 ? 8 : 4;
    this.useable = filterPoint(this.transfer === 0 ? this.accountDetails[this.curIndex].amount : this.coinContracts[this.curIndex].contractAccountList[this.accountIdx].balance, point);
    this.unit = this.accountDetails[index].enName.indexOf('USDT') > -1 ? 'USDT': this.accountDetails[index].enName;
  },
  methods: {
    ...mapActions(['fundsTransfer']),
    all() {
      this.amount = this.useable;
    },
    changeCount() {
      this.amount = event.target.value;
      this.amount = this.amount.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
      this.amount = this.amount.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
      this.amount = parseInt(this.transfer) === 0 ? this.amount.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3') : this.amount.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, '$1$2.$3'); //只能输入两个小数
      this.amount = this.amount.replace('.', '$#$').replace(/\./g,"").replace('$#$', '.');
      if(this.amount.indexOf('.') < 0 && this.amount !== ''){ //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
        this.amount = parseFloat(this.amount);
      }
    },
    back () {
      this.$router.go(-1);
    },
    transferIdx () {
      this.transfer = this.transfer === 0 ? 1 : 0;
      this.amount = '';
      const point = parseInt(this.transfer) === 0 ? 8 : 4;
      this.useable = filterPoint(this.transfer === 0 ? this.accountDetails[this.curIndex].amount : this.coinContracts[this.curIndex].contractAccountList[this.accountIdx].balance, point);
    },
    changeCoinIdx(index) {
      this.curIndex = index;
      this.isShowList = false;
      this.unit = this.accountDetails[index].enName.indexOf('USDT') > -1 ? 'USDT': this.accountDetails[index].enName;
      const point = parseInt(this.transfer) === 0 ? 8 : 4;
      this.useable = filterPoint(this.transfer === 0 ? this.accountDetails[this.curIndex].amount : this.coinContracts[this.curIndex].contractAccountList[this.accountIdx].balance, point);
    },
    changeAccountIdx(index) {
      this.accountIdx = index;
      this.showtransferAccount = false;
      const point = parseInt(this.transfer) === 0 ? 8 : 4;
      this.useable = filterPoint(this.transfer === 0 ? this.accountDetails[this.curIndex].amount : this.coinContracts[this.curIndex].contractAccountList[index].balance, point);
    },
    validate () {
      if (numeral(this.amount)._value <= 0) {
        this.$toast(this.$t('notice.transferMin'));
        return false;
      }
      if (numeral(this.amount)._value > this.useable) {
        this.$toast(this.$t('notice.transferMax'));
        return false;
      }
    },
    confirm() {
      if (this.validate() === false) return;
      const transferData = {
        amount: this.amount,
        coinType: this.accountDetails[this.curIndex].coinType,
        contractType: this.coinContracts[this.curIndex].contractAccountList[this.accountIdx].contId, // 合约账户类型
        fundsTransfer: this.transfer + 1,  // 1资金账户->合约账户；2合约账户->资金账户,
        userId: decryptByDES(getCookie('token'))
      }
      this.fundsTransfer(transferData).then(() => {
        if (this.transfer === 0) {
          this.accountDetails[this.curIndex].amount = numeral(this.accountDetails[this.curIndex].amount)._value - numeral(this.amount)._value;
          this.coinContracts[this.curIndex].contractAccountList[this.accountIdx].balance = numeral(this.coinContracts[this.curIndex].contractAccountList[this.accountIdx].balance)._value + numeral(this.amount)._value;
          const point = parseInt(this.transfer) === 0 ? 8 : 4;
          this.useable = filterPoint(this.accountDetails[this.curIndex].amount, point);
        } else {
          this.coinContracts[this.curIndex].contractAccountList[this.accountIdx].balance = numeral(this.coinContracts[this.curIndex].contractAccountList[this.accountIdx].balance)._value - numeral(this.amount)._value;
          this.accountDetails[this.curIndex].amount = numeral(this.accountDetails[this.curIndex].amount)._value + numeral(this.amount)._value;
          const point = parseInt(this.transfer) === 0 ? 8 : 4;
          this.useable = filterPoint(this.coinContracts[this.curIndex].contractAccountList[this.accountIdx].balance, point);
        }
        this.amount = ''
        localStorage.setItem('accountDetails', JSON.stringify(this.accountDetails));
        localStorage.setItem('coinContracts', JSON.stringify(this.coinContracts));
        this.$toast(this.$t('global.actionSuccess'));
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'))
      })
    }
  },
}
</script>
<style lang="less" scoped>
  .button{
    width: 340px;
    border-bottom: solid 1px #F1F1F1;
    border-radius: 2px;
    margin: 15px auto;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p{
      padding-left: 12px;
      font-size: 14px;
    }
    img{
      vertical-align: middle;
      padding-right: 12px;
      width: 16px;
    }
  }
  .switch_notice{
    width: 340px;
    height: 200px;
    line-height: 200px;
    margin: 15px auto;
    text-align: center;
    font-size: 14px;
    color: #24324C;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.01);
    border-radius: 4px;
    background-color: #ffffff;
  }
  .center{
    width: 340px;
    height: auto;
    background-color: #ffffff;
    border-radius: 2px;
    margin: 0 auto;
    padding-top: 16px;
    padding-bottom: 16px;
    .center_top{
      width: 309px;
      height: 80px;
      border-radius: 3px;
      border: solid 1px #E8ECEF;
      margin: 0 auto;
      display: flex;
      .circle{
        width: 28px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        img{
          width: 4px;
          height: 4px;
          margin-bottom: 3px;
          &:nth-child(1){
            width: 8px;
            height: 8px;
            margin-bottom: 5px;
          }
          &:nth-child(4){
            margin-bottom: 6px;
          }
          &:nth-last-child(1){
            width: 8px;
            height: 8px;
            margin-bottom: 0;
          } 
        }
      }
      .items{
        .item{
          padding-top: 4px;
          width: 214px;
          height: 34px;
          border-bottom: solid 1px #F7FAFD;
          display: flex;
          align-items: center;
          &:nth-last-child(1) {
            border-bottom: none;
          }
          span{
            color: #9099A7;
            font-size: 14px;
            padding-right: 16px;
          }
          p{
            color: #24324C;
            font-family: 'Semibold';
            font-size: 12px;
          }
          img{
            width: 14px;
            height: 8px;
            margin-left: 7px;
          }
        }
      }
      .action{
        width: 64px;
        height: 100%;
        background-color: #F7F7FA;
        flex: 1;
        position: relative;
        img{
          width: 38px;
          height: 38px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .center_form{
      width: 300px;
      margin: 0 auto;
      .item{
        position: relative;
        display: flex;
        flex-direction: column;
        &:nth-child(2) {
          padding-top: 12px;
          border-bottom: solid 1px #F7FAFD;
          padding-bottom: 2px;
        }
        label{
          padding-top: 16px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          font-family: 'Semibold';
          color: #24324C;
        }
        input{
          margin-top: 10px;
          height: 20px;
          line-height: 20px;
          color: #9099A7;
          font-family: 'Semibold';
          border: none;
          font-size: 14px;
        }
        span.unit{
          height: 20px;
          line-height: 20px;
          position: absolute;
          right: 45px;
          bottom: 2px;
          color: #9099A7;
          font-family: 'Semibold';
          padding-right: 6px;
          border-right: solid 1px #CFD6DD;
          font-size: 12px;
        }
        span.all{
          height: 20px;
          line-height: 20px;
          position: absolute;
          right: 4px;
          bottom: 2px;
          color: #007AFF;
          padding-left: 10px;
          font-family: 'Semibold';
          font-size: 12px;
        }
      }
      .form_notice{
        font-size: 12px;
        color: #9099A7;
        height: 30px;
        line-height: 30px;
      }
    }
    .transfer_notice{
      width: 283px;
      padding-top: 15px;
      padding-bottom: 15px;
      color: #9099A7;
      background-color: #F7F7FA;
      font-size: 12px;
      margin: 30px auto 0;
      padding-left: 12px;
      padding-right: 5px;
      line-height: 17px;
    }
    .btn{
      margin-top: 52px;
      margin-bottom: 12px;
    }
  }
</style>
