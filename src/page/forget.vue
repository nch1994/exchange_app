<template>
  <div class="">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('input.forget') }}</p>
      <span />
    </div>
    <div class="item">
      <input v-model="user" type="text" :placeholder="$t('input.user')">
      <button :disabled="disabled1" class="send" @click="getCode">{{ codeNotice1 }}</button>
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
    <button type="button" class="btn" @click="submit">
      {{ $t('global.confirm') }}
    </button>
  </div>
</template>

<script type="es6">
import reg from '@/utils/reg';
import { mapActions } from 'vuex';
import md5 from 'md5';
let timer1 = null;
export default {
  name: 'Forget',
  data() {
    return {
      user: '',
      code: '',
      wait: 0,
      codeTimer: 60,
      pwd: '',
      pwd2: '',
      codeNotice1: this.$t('input.getCode'),
      disabled1: false
    };
  },
  destroyed() {
    clearInterval(timer1);
  },
  methods: {
    ...mapActions(['sendSMS', 'resetPassword']),
    back () {
      this.$router.go(-1)
    },
    validate () {
      if (this.user.length < 1) {
        this.$toast(this.$t('notice.user'));
        return false
      }
      if (this.code.length < 1) {
        this.$toast(this.$t('notice.code'))
        return false
      }
      if (!reg.registerNewPassword.test(this.pwd)) {
        this.$toast(this.$t('notice.registerNewPwd'));
        return false;
      }
      if (this.pwd !== this.pwd2) {
        this.$toast(this.$t('notice.confirmPwd'));
        return false;
      }
    },
    beforeGetCode() {
      if (!reg.phone.test(this.user) && !reg.email.test(this.user)) {
        this.$toast(this.$t('notice.user'))
        return false;
      }
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
      const countryCode = reg.phone.test(this.user) ? country : '';
      const number = this.user;
      const data = {countryCode, number};
      this.sendSMS(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
      }).catch(() => {
        this.$toast(this.$t('global.wait'))
      })
    },
    submit () {
      if (this.validate() === false) return;
      const { country } = this.$store.state;
      const data = {
        number: this.user,
        verificationCode: this.code,
        newPassword: md5(this.pwd),
        countryCode: reg.phone.test(this.user) ? country : '',
        type: 0 // 0为登录密码； 1为交易密码
      }
      this.resetPassword(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000)
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'))
      })
    }
  }
};
</script>
<style lang="less" scoped>
  .tabbar{
    margin-bottom: 100px;
  }
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
      width: 220px;
      margin-top: 19px;
      border: none;
      outline: none;
      font-size: 14px;
      color: #000000;
      flex: 1;
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
