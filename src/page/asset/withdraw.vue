<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('asset.withdraw.title') }}</p>
      <span />
    </div>
    <div @click="isShowList = true" class="button">
      <p v-if="list.length > 0">{{ list[curIndex].enName }}</p>
      <p>{{ $t('global.chooseCoin') }}></p>
    </div>
    <div class="info" v-if="list.length > 0 && withdrawalSwitch === 1">
      <ul>
        <li>
          <label>{{ $t('asset.withdraw.available') }}</label>
          <p>{{ accountDetails[curIndex].available }} {{ unit }}</p>
        </li>
        <li>
          <label for="">{{ $t('asset.withdraw.address') }}</label>
          <input type="text" :placeholder="$t('input.addressNotice')" v-model="address">
          <!-- <img src="@/static/img/scan.png" alt=""> -->
        </li>
        <li class="memo" v-show="accountDetails[curIndex].coinType === 4">
          <label for="">{{ $t('asset.withdraw.memo') }} <span class="">({{ $t('asset.withdraw.memoNotice') }})</span></label>
          <input type="text" :placeholder="$t('asset.withdraw.memoInput')" v-model="memo">
          <!-- <img src="@/static/img/scan.png" alt=""> -->
        </li>
        <li class="amount">
          <label for="">{{ $t('asset.withdraw.lines') }}</label>
          <input type="text" :placeholder="$t('input.withdrawLines')" v-model="amount" @input="changeCount()">
          <p @click="all">{{ $t('asset.withdraw.all') }}</p>
        </li>
        <li>
          <label><span>{{ $t('asset.withdraw.poundage') }}</span>{{ list[curIndex].poundage || 0 }}</label>
        </li>
      </ul>
      <p class="realAmount">{{ $t('asset.withdraw.realAmount') }}：{{(amount - list[curIndex].poundage).toFixed(2) > 0 ? (amount - list[curIndex].poundage).toFixed(2) : '0.00' }}</p>
      <button class="btn" @click="next()">{{ $t('global.confirm') }}</button>
    </div>
    <div v-show="withdrawalSwitch === 0" class="switch_notice">{{ $t('notice.isClosed') }}</div>
    <div class="notice">
      <p>{{ $t('asset.withdraw.notice') }}</p>
      <ul>
        <li>{{ $t('asset.withdraw.noticeList1') }}</li>
        <li>{{ $t('asset.withdraw.noticeList2')[0] }}{{ unit }}{{ $t('asset.withdraw.noticeList2')[1] }}</li>
        <li>{{ $t('asset.withdraw.noticeList3') }}</li>
        <li>{{ $t('asset.withdraw.noticeList4') }}</li>
      </ul>
    </div>
    <div v-show="showConfirm">
      <WithdrawConfirm @hideConfirm="hideConfirm" @confirmWithdraw="confirmWithdraw" />
    </div>
    <van-popup v-model="isShowList" position="left" :style="{ width: '70%', height: '100%' }">
      <AccountList :curIdx="curIndex" :list="list" @confirm="changeAccountIdx" @cancel="isShowList = false" />
    </van-popup>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import numeral from 'numeral';
import WithdrawConfirm from './withdraw_confirm';
import { Dialog } from 'vant';
import { getCookie, decryptByDES } from '@/utils/utils';
import AccountList from '@/components/coinList.vue';

export default {
  name: 'Withdraw',
  components: {
    WithdrawConfirm,
    AccountList
  },
  data () {
    return {
      isShowList: false,
      address: '',
      amount: '',
      curIndex: 0,
      showConfirm: false,
      userInfo: {},
      accountDetails: [],
      list: [],
      withdrawalSwitch: 0,
      unit: 'USDT',
      memo: ''
    }
  },
  mounted () {
    this.userInfo = JSON.parse(getCookie('userInfo'));
    this.accountDetails = JSON.parse(localStorage.getItem('accountDetails'));
    this.list = JSON.parse(localStorage.getItem('accountDetails'));
    let index = this.accountDetails.findIndex((element) => {
      return parseFloat(element.coinType) === parseFloat(this.$route.params.index);
    });
    index = index < 0 ? 0 : index;
    this.withdrawalSwitch = this.list[index].withdrawalSwitch;
    this.curIndex = parseInt(index);
    this.unit = this.list[index].enName.indexOf('USDT') > -1 ? 'USDT' : this.list[index].enName
  },
  methods: {
    ...mapActions(['withdraw']),
    changeCount() {
      this.amount = event.target.value;
      this.amount = this.amount.replace(/[^\d.]/g, ''); // 清除“数字”和“.”以外的字符
      this.amount = this.amount.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
      this.amount = this.amount.replace(/^(\-)*(\d+)\.(\d\d\d\d\d\d\d\d).*$/, '$1$2.$3'); //只能输入两个小数
      this.amount = this.amount.replace('.', '$#$').replace(/\./g,"").replace('$#$', '.');
      if(this.amount.indexOf('.') < 0 && this.amount !== ''){ //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
        this.amount = parseFloat(this.amount);
      }
    },
    changeAccountIdx(index) {
      this.curIndex = index;
      this.isShowList = false;
      this.withdrawalSwitch = this.list[index].withdrawalSwitch;
      this.unit = this.list[index].enName.indexOf('USDT') > -1 ? 'USDT' : this.list[index].enName
      this.amount = ''
    },
    confirmWithdraw(tradePassword, mobileVerificationCode, emailVerificationCode) {
      const amount = this.amount;  // 传给后台计算手续费之前的
      const toAddress = this.address;
      const memo = this.memo;
      const coinId = this.accountDetails[this.curIndex].coinType;
      const coinType = this.accountDetails[this.curIndex].coinType;
      const userId = decryptByDES(getCookie('token'));
      let data = { amount, coinId, toAddress, tradePassword, userId, mobileVerificationCode, coinType };
      if (parseInt(this.accountDetails[this.curIndex].coinType) === 4) {
        data = { amount, coinId, toAddress, tradePassword, userId, mobileVerificationCode, coinType, memo };
      }
      if (this.userInfo.emailAuth === 1) {
        if (parseInt(this.accountDetails[this.curIndex].coinType) === 4) {
          data = { amount, coinId, toAddress, tradePassword, userId, mobileVerificationCode, emailVerificationCode, coinType, memo };
        } else {
          data = { amount, coinId, toAddress, tradePassword, userId, mobileVerificationCode, emailVerificationCode, coinType }
        }
      }
      this.withdraw(data).then(() => {
        this.$router.push('/asset/withdrawSuccess');
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'))
      })
    },
    hideConfirm() {
      this.showConfirm = false;
    },
    validate () {
      if (this.address.length < 1) {
        this.$toast(this.$t('notice.withdrawAddress'));
        return false;
      }
      if (this.memo.length < 1 && parseInt(this.accountDetails[this.curIndex].coinType) === 4) {
        this.$toast(this.$t('asset.withdraw.memoInput'));
        return false;
      }
      if (numeral(this.amount)._value < numeral(this.list[this.curIndex].min)._value) {
        this.$toast(this.$t('notice.withdrawAomuntMin') + this.list[this.curIndex].min);
        return false;
      }
      if (numeral(this.amount)._value > numeral(this.list[this.curIndex].max)._value) {
        this.$toast(this.$t('notice.withdrawAomuntMax') + this.list[this.curIndex].max);
        return false;
      }
      if (numeral(this.amount)._value > numeral(this.accountDetails[this.curIndex].amount)._value) {
        this.$toast(this.$t('notice.withdrawAomuntNotice'));
        return false;
      }
    },
    back () {
      this.$router.go(-1)
    },
    all() {
      this.amount = this.accountDetails[this.curIndex].amount
    },
    checkUserInfo() {
      const userInfo = JSON.parse(getCookie('userInfo'))
      if (!userInfo.mobile) {
        Dialog.confirm({
          title: this.$t('global.confirm'),
          message: this.$t('notice.bindingPhone')
        }).then(() => {
          this.$router.push('/safe/phone')
        })
        return false;
      }
      if (!userInfo.tradePassword) {
        Dialog.confirm({
          title: this.$t('global.confirm'),
          message: this.$t('notice.assetPwdSetUp')
        }).then(() => {
          this.$router.push('/safe/fundpwd')
        })
        return false;
      }
      if (!userInfo.front) {
        Dialog.confirm({
          title: this.$t('global.confirm'),
          message: this.$t('notice.idAuth')
        }).then(() => {
          this.$router.push('/safe/identity')
        })
        return false;
      }
    },
    next () {
      if (this.checkUserInfo() === false) return;
      if (this.validate() === false) return;
      this.showConfirm = true;
    }
  }
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
  .info{
    width: 340px;
    background-color: #ffffff;
    border-radius: 2px;
    margin: 0 auto;
    padding-bottom: 5px;
    ul {
      width: 311px;
      margin: 0 auto;
      position: relative;
      li{
        border-bottom: solid 1px #F7FAFD;
        display: flex;
        flex-direction: column;
        text-align: left;
        position: relative;
        &:nth-child(1){
          padding-top: 5px;
        }
        &:nth-child(2) {
          padding-top: 10px;
        }
        &.amount {
          padding-top: 4px;
        }
        &:nth-last-child(1){
          border-bottom: none;
          span:nth-child(1) {
            padding-right: 12px;
          }
        }
        label{
          line-height: 30px;
          height: 30px;
          color: #24324C;
          font-size: 12px;
          font-family: 'Medium';
        }
        input, &:nth-child(1) p{
          width: 240px;
          height: 20px;
          line-height: 20px;
          color: #24324C;
          font-family: 'Regular';
          margin-bottom: 10px;
          border: none;
          font-size: 12px;
        }
        img{
          width: 18px;
          height: 18px;
          position: absolute;
          bottom: 10px;
          right: 0;
        }
        &.amount p{
          position: absolute;
          bottom: 10px;
          right: 0;
          font-size: 12px;
          height: 20px;
          line-height: 20px;
          color: #007AFF;
        }
      }
      .memo{
        span{
          color: #FF000090;
          font-size: 12px;
          text-align: right;
          line-height: 14px;
          height: auto;
          padding-left: 10px;
        }
      }
    }
  }
  .btn{
    margin-bottom: 19px;
    margin-top: 0;
  }
  .realAmount{
    margin-top: 27px;
    height: 30px;
    line-height: 30px;
    text-align: right;
    font-size: 12px;
    color: #24324C;
    margin-right: 30px;
  }
  .notice{
    padding-left: 18px;
    padding-right: 34px;
    padding-top: 2px;
    text-align: left;
    p{
      font-size: 12px;
      color: #24324C;
      font-family: 'Regular';
      line-height: 42px;
      height: 42px;
    }
    ul{
      li{
        color: #9099A7;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
</style>
