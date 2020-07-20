<template>
  <div class="mask">
    <div class="items">
      <img src="@/static/img/close.png" class="close" @click="close()" alt="">
      <p class="title">{{type === 'login' ? $t('mine.safe.forgetLogin') : $t('mine.safe.forgetAsset') }}</p>
      <div class="item">
        <input :value="userInfo.mobile || userInfo.email" readonly :placeholder="$t('input.phone')">
        <button :disabled="disabled1" class="send" @click="getCode()">{{ codeNotice1 }}</button>
      </div>
      <div class="item">
        <input v-model="code" type="number" :placeholder="$t('input.code')">
      </div>
      <div class="item">
        <input v-model="pwd" type="password" :placeholder="$t('input.pwd')">
      </div>
      <div class="item">
        <input v-model="pwd2" type="password" :placeholder="$t('input.confirmPwd')">
      </div>
      <button type="button" class="btn" @click="confirm">{{ $t('global.confirm') }}</button>
    </div>
  </div>
</template>
<script>
import reg from '@/utils/reg';
import { mapActions } from 'vuex';
import { getCookie } from '@/utils/utils';
import md5 from 'md5';
let timer1 = null;
export default {
  name: 'ForgetLayer',
  props: ['type'],
  data () {
    return {
      code: '',
      codeNotice1: '',
      disabled1: false,
      pwd: '',
      pwd2: '',
      userInfo: {}
    }
  },
  mounted() {
    this.codeNotice1 = this.$t('input.getCode');
    this.userInfo = JSON.parse(getCookie('userInfo'));
  },
  methods: {
    ...mapActions(['resetPassword', 'sendSMS']),
    validate () {
      if (this.code.length < 1) {
        this.$toast(this.$t('notice.code'));
        return false;
      }
      const regs = this.type === 'login' ? reg.registerNewPassword : reg.number;
      const toast = this.type === 'login' ? this.$t('notice.registerNewPwd') : this.$t('notice.asset');
      if (!regs.test(this.pwd)) {
        this.$toast(toast);
        return false;
      }
      if (this.pwd !== this.pwd2) {
        this.$toast(this.$t('notice.confirmPwd'));
        return false;
      }
    },
    close() {
      this.$emit('hideForget');
      this.code = '';
      this.pwd = '';
      this.pwd2 = ''
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
      const number = this.userInfo.mobile || this.userInfo.email;
      const countryCode = reg.phone.test(number) ? country : '';
      const data = {countryCode, number};
      this.sendSMS(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
      }).catch(() => {
        this.$toast(this.$t('global.wait'))
      })
    },
    confirm () {
      if (this.validate() === false) return;
      const { country } = this.$store.state;
      const number = this.userInfo.mobile || this.userInfo.email;
      const type = this.type === 'login' ? 0 : 1;
      const data = {
        countryCode: reg.phone.test(number) ? country : '',
        number,
        type,
        verificationCode: this.code,
        newPassword: md5(this.pwd)
      }
      this.resetPassword(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
        this.$emit('hideForget');
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'))
      })
    }
  }
}
</script>
<style lang="less" scoped>
.mask{
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  .title{
    height: 48px;
    line-height: 48px;
    padding-left: 17px;
  }
  .close{
    width: 20px;
    height: 20px;
    position: absolute;
    top: 16px;
    right: 16px;
  }
  .items{
    z-index: 20;
    width: 340px;
    height: auto;
    background-color: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 16px;
    transform: translate(-50%, -50%);
    div.item {
      width: 300px;
      height: 47px;
      border-bottom: solid 1px #F0F0F0;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      input{
        width: 200px;
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
      width: 300px;
    }
  }
}
  
</style>
