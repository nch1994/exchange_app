<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('mine.safe.fundPwd') }}</p>
      <span />
    </div>
    <div class="items-wrap">
      <div class="items">
        <p />
        <div class="item">
          <input :value="userInfo.mobile || userInfo.email" type="text" readonly>
          <button :disabled="disabled1" class="send" @click="getCode(0)">{{ codeNotice1 }}</button>
        </div>
      </div>
      <div class="items">
        <p>{{ $t('input.code') }}</p>
        <div class="item">
          <input v-model="code" type="text" :placeholder="$t('input.code')">
        </div>
      </div>

      <div class="items">
        <p>{{ $t('input.asset') }}</p>
        <div class="item">
          <input v-model="pwd" :type="showeye1 ? 'password' : 'text'" :placeholder="$t('input.asset')">
          <img v-if="showeye1" src="@/static/img/eye.png" @click="showeyefn1()" alt="">
          <img v-else src="@/static/img/eye2.png" @click="showeyefn1()" alt="">
        </div>
      </div>
      <div class="items">
        <p>{{ $t('input.confirmAsset') }}</p>
        <div class="item item2">
          <input v-model="pwd2" :type="showeye2 ? 'password' : 'text'" :placeholder="$t('input.confirmAsset')">
          <img v-if="showeye2" src="@/static/img/eye.png" alt="" @click="showeyefn2()">
          <img v-else src="@/static/img/eye2.png" alt="" @click="showeyefn2()">
        </div>
      </div>
    </div>
    <button type="button" class="btn" @click="confirm">{{ $t('global.submit') }}</button>
  </div>
</template>
<script>
import reg from '@/utils/reg';
import { getCookie, setCookie } from '@/utils/utils';
import { mapActions } from 'vuex';
import md5 from 'md5';
let timer1 = null;
export default {
  name: 'Fundpwd',
  data () {
    return {
      pwd: '',
      pwd2: '',
      showeye1: true,
      showeye2: true,
      userInfo: {},
      codeNotice1: '',
      code: '',
      disabled1: false
    }
  },
  mounted() {
    this.userInfo = JSON.parse(getCookie('userInfo'));
    this.codeNotice1 = this.$t('input.getCode');
  },
  methods: {
    ...mapActions(['sendSMS', 'resetPassword']),
    validate () {
      if (this.code.length < 1) {
        this.$toast(this.$t('notice.code'))
        return false;
      }
      if (!reg.number.test(this.pwd)) {
        this.$toast(this.$t('notice.asset'))
        return false
      }
      if (this.pwd2 !== this.pwd) {
        this.$toast(this.$t('notice.confirmPwd'))
        return false
      }
    },
    beforeGetCode() {
      let time1 = 60;
      this.disabled1 = true;
      timer1 = setInterval(() => {
        --time1;
        this.codeNotice1 = `${time1}s`;
        if (time1 === 0) {
          clearInterval(timer1);
          this.codeNotice1 = this.$t('input.regainCode');
          this.disabled1 = false;
        }
      }, 1000)
    },
    getCode() {
      if (this.beforeGetCode() === false) return;
      const { country } = this.$store.state;
      const userInfo = JSON.parse(getCookie('userInfo'));
      const countryCode = reg.phone.test(userInfo.mobile) ? country : '';
      const number = userInfo.mobile;
      const data = {countryCode, number};
      this.sendSMS(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
      }).catch(() => {
        this.$toast(this.$t('global.wait'))
      })
    },
    showeyefn1 () {
      this.showeye1 = !this.showeye1
    },
    showeyefn2 () {
      this.showeye2 = !this.showeye2
    },
    back () {
      this.$router.go(-1)
    },
    confirm () {
      if (this.validate() === false) return
      const userInfo = JSON.parse(getCookie('userInfo'));
      const countryCode = this.$store.state.country;
      const data = {
        countryCode,
        newPassword: md5(this.pwd),
        number: userInfo.mobile,
        type: 1,
        verificationCode: this.code
      }
      this.resetPassword(data).then(() => {
        let userInfo = JSON.parse(getCookie('userInfo'));
        userInfo.tradePassword = md5(this.pwd);
        setCookie('userInfo', JSON.stringify(userInfo));
        
        this.$toast(this.$t('global.actionSuccess'));
        this.$router.go(-1)
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'))
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .items-wrap{
    border-radius: 2px;
    overflow: hidden;
  }
  .items {
    width: 340px;
    margin: 0 auto;
    background-color: #ffffff;
    p{
      text-align: left;
      padding-top: 15px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #24324C;
      padding-left: 16px;
    }
    
  }
  div.item {
    width: 310px;
    height: 30px;
    border-bottom: solid 1px #F0F0F0;
    margin-left: 17px;
    margin-right: 17px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    input{
      width: 220px;
      margin-top: 10px;
      border: none;
      outline: none;
      font-size: 12px;
      color: #000000;
    }
    img{
      width: 16px;
      height: 16px;
    }
    .send{
      color: #007AFF;
      font-size: 14px;
    }
  }
  .item2{
    border-bottom: none !important;
  }
</style>
