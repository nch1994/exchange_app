<template>
  <div class="mask">
    <div class="inner">
      <img src="@/static/img/close.png" class="close" @click="close()" alt="">
      <div class="item">
        <input v-model="assetPwd" :placeholder="$t('input.asset')" type="password">
      </div>
      <div class="item">
        <input :value="userInfo.mobile || userInfo.email" type="text">
        <button :disabled="disabled1" class="send" @click="getCode(0)">{{ codeNotice1 }}</button>
      </div>
      <div class="item">
        <input v-model="phoneCode" type="number" :placeholder="$t('input.mobileCode')">
      </div>

      <div class="item" v-show="userInfo.emailAuth === 1">
        <input :value="userInfo.email" type="text">
        <button :disabled="disabled2" class="send" @click="getCode(1)">{{ codeNotice2 }}</button>
      </div>
      <div class="item" v-show="userInfo.emailAuth === 1">
        <input v-model="emailCode" type="number" :placeholder="$t('input.emailCode')">
      </div>

      <button type="button" class="btn" @click="submit">
        {{ $t('global.confirm') }}
      </button>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { getCookie } from '@/utils/utils';
let timer1, timer2 = null;
import md5 from 'md5'
export default {
  name: 'WithdrawConfirm',
  data() {
    return {
      assetPwd: '',
      phoneCode: '',
      emailCode: '',
      codeNotice1: '',
      codeNotice2: '',
      disabled1: false,
      disabled2: false,
      userInfo: {}
    }
  },
  mounted() {
    this.codeNotice1 = this.$t('input.getMobileCode');
    this.codeNotice2 = this.$t('input.getEmailCode');
    this.userInfo = JSON.parse(getCookie('userInfo'));
  },
  methods: {
    ...mapActions(['sendSMS']),
    close() {
      this.$emit('hideConfirm');
    },
    validate () {
      if (this.assetPwd.length < 1) {
        this.$toast(this.$t('notice.asset'));
        return false;
      }
      if (this.phoneCode.length < 1) {
        this.$toast(this.$t('notice.mobileCode'));
        return false
      }
      if (this.userInfo.emailAuth === 1 && this.emailCode.length < 1) {
        this.$toast(this.$t('notice.emailCode'));
        return false
      }
    },
    beforeGetCode(type) {
      if (type === 0) {
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
      } else {
        let time2 = 60;
        this.disabled2 = true;
        timer2 = setInterval(() => {
          --time2;
          this.codeNotice2 = `${time2}s`;
          if (time2 === 0) {
            clearInterval(timer2);
            this.codeNotice2 = this.$t('input.regainCode');
            this.disabled2 = false;
          }
        }, 1000)
      }
    },
    getCode(type) {
      if (this.beforeGetCode(type) === false) return;
      let number, countryCode = '';
      if (type === 0) {
        number = this.userInfo.mobile;
        countryCode = this.userInfo.countryCode
      } else if (type === 1) {
        number = this.userInfo.email;
        countryCode = ''
      }
      const data = {countryCode, number};
      this.sendSMS(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
      }).catch(() => {
        this.$toast(this.$t('global.wait'))
      })
    },
    submit() {
      if (this.validate() === false) return;
      this.$emit('confirmWithdraw', md5(this.assetPwd), this.phoneCode, this.emailCode)
    }
  }
}
</script>
<style lang="scss" scoped>
  .mask{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
    .inner{
      width: 340px;
      border-radius: 16px;
      background-color: #ffffff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding-top: 60px;
      .close{
        width: 20px;
        height: 20px;
        position: absolute;
        top: 20px;
        right: 20px;
      }
      div.item {
        width: 300px;
        height: 47px;
        border-bottom: solid 1px #F0F0F0;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        input{
          width: 160px;
          margin-top: 19px;
          border: none;
          outline: none;
          font-size: 14px;
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
      .btn{
        width: 280px;

      }
    }
  }
</style>
