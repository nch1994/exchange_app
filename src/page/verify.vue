<template>
  <div class="">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('input.verify') }}</p>
      <span />
    </div>
    
    <div class="item" v-show="verifyInfo.mobileAuth === 1">
      <input :value="verifyInfo.mobile" type="text" readonly>
      <button :disabled="disabled1" class="send" @click="getCode(0)">{{ codeNotice1 }}</button>
    </div>
    <div class="item" v-show="verifyInfo.mobileAuth === 1">
      <input v-model="phoneCode" type="number" :placeholder="$t('input.mobileCode')">
    </div>

    <div class="item" v-show="verifyInfo.emailAuth === 1">
      <input :value="verifyInfo.email" type="text" readonly>
      <button :disabled="disabled2" class="send" @click="getCode(1)">{{ codeNotice2 }}</button>
    </div>
    <div class="item" v-show="verifyInfo.emailAuth === 1">
      <input v-model="emailCode" type="number" :placeholder="$t('input.emailCode')">
    </div>

    <button type="button" class="btn" @click="submit">
      {{ $t('global.confirm') }}
    </button>
  </div>
</template>

<script type="es6">
import { mapState, mapActions } from 'vuex';
import { setCookie, encryptByDES, encryptStr } from '@/utils/utils';
let timer1, timer2 = null;
export default {
  name: 'Verify',
  data() {
    return {
      phoneCode: '',
      emailCode: '',
      codeNotice1: this.$t('input.getMobileCode'),
      codeNotice2: this.$t('input.getEmailCode'),
      disabled1: false,
      disabled2: false,
    };
  },
  computed: mapState([
    'verifyInfo'
  ]),
  mounted() {
    const { verifyInfo } = this.$store.state;
    if (verifyInfo.mobileAuth !== 1 && verifyInfo.emailAuth !== 1) {
      this.$router.go(-1);
    }
  },
  destroyed() {
    clearInterval(timer1);
    clearInterval(timer2);
  },
  methods: {
    ...mapActions([
      'sendSMS',
      'loginVerification'
    ]),
    back () {
      this.$router.go(-1)
    },
    validate () {
      const { verifyInfo } = this.$store.state;
      if (verifyInfo.mobileAuth === 1 && this.phoneCode.length < 1) {
        this.$toast(this.$t('notice.mobileCode'));
        return false
      }
      if (verifyInfo.emailAuth === 1 && this.emailCode.length < 1) {
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
      const { verifyInfo } = this.$store.state;
      let number, countryCode = '';
      if (type === 0) {
        number = verifyInfo.mobile;
        countryCode = verifyInfo.countryCode
      } else if (type === 1) {
        number = verifyInfo.email;
        countryCode = ''
      }
      const data = {countryCode, number};
      this.sendSMS(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
      }).catch(() => {
        this.$toast(this.$t('global.wait'))
      })
    },
    submit () {
      if (this.validate() === false) return;
      const { verifyInfo } = this.$store.state;
      let data = {};
      if (verifyInfo.mobileAuth === 1 && verifyInfo.emailAuth === 1) {
        const email = verifyInfo.email;
        const emailVerificationCode = this.emailCode;
        const mobile = verifyInfo.mobile;
        const mobileVerificationCode = this.phoneCode;
        const countryCode = verifyInfo.countryCode;
        data = { countryCode, email, emailVerificationCode, mobile, mobileVerificationCode };
      } else if (verifyInfo.mobileAuth === 1) {
        const mobile = verifyInfo.mobile;
        const mobileVerificationCode = this.phoneCode;
        const countryCode = verifyInfo.countryCode;
        data = { countryCode, mobile, mobileVerificationCode };
      } else if (verifyInfo.emailAuth === 1) {
        const email = verifyInfo.email;
        const emailVerificationCode = this.emailCode;
        const countryCode = '';
        data = { countryCode, email, emailVerificationCode };
      };
      this.loginVerification(data).then(() => {
        setCookie('token', encryptByDES(`${verifyInfo.userId}${encryptStr}`));
        setCookie('userInfo', JSON.stringify(verifyInfo));
        this.$router.push('/index');
      }).catch((msg) => {
        // msg === '' || !msg ? this.$toast(this.$t('global.wait')) : this.$toast(msg)
        this.$toast(msg || this.$t('global.wait'));
      })
    }
  }
};
</script>
<style lang="less" scoped>
  .close{
    width: 16px;
    height: 16px;
    position: absolute;
    right: 25px;
    top: 16px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  div.item {
    width: 330px;
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
      flex: 1;
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
</style>
