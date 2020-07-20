<template>
  <div class="">
    <div class="tabbar">
      <span />
      <p class="title">{{ type === 0 ? $t('input.phoneRegister') : $t('input.emailRegister') }}</p>
      <span />
    </div>
    
    <div v-show="type === 0" class="item">
      <input v-model="phone" type="text" :placeholder="$t('input.phone')">
      <button :disabled="disabled1" class="send" @click="getCode(0)">{{ codeNotice1 }}</button>
    </div>
    <div v-show="type === 1" class="item">
      <input v-model="email" type="text" :placeholder="$t('input.email')">
      <button :disabled="disabled2" class="send" @click="getCode(1)">{{ codeNotice2 }}</button>
    </div>

    <div class="item">
      <input v-show="type === 0" v-model="phoneCode" type="number" :placeholder="$t('input.mobileCode')">
      <input v-show="type === 1" v-model="emailCode" type="number" :placeholder="$t('input.emailCode')">
    </div>

    <div class="item">
      <input v-model="pwd" type="password" :placeholder="$t('input.pwd')">
    </div>
    <div class="item">
      <input v-model="pwd2" type="password" :placeholder="$t('input.confirmPwd')">
    </div>

    <div class="item">
      <input v-model="inviteCode" type="text" :placeholder="$t('input.inviteCode')">
    </div>

    <button type="button" class="btn" @click="confirm">{{ $t('global.confirm') }}</button>
    <a class="btn download" href="https://h5.starqueen.top/guide_page/">{{ $t('global.download') }}</a>
    <p class="change">
      <span @click="change">{{ type === 0 ? $t('input.emailRegister') : $t('input.phoneRegister') }}</span>
      <router-link to="login" class="login">{{ $t('global.login') }}</router-link>
    </p>
  </div>
</template>
<script type="es6">
import reg from '@/utils/reg';
import { mapActions } from 'vuex';
import md5 from 'md5';
import { setCookie, encryptByDES, encryptStr } from '@/utils/utils';
let timer1, timer2 = null;
export default {
  name: 'Forget',
  data() {
    return {
      phone: '',
      email: '',
      phoneCode: '',
      emailCode: '',
      disabled1: false,
      disabled2: false,
      codeNotice1: this.$t('input.getMobileCode'),
      codeNotice2: this.$t('input.getEmailCode'),
      type: 0,  // 0为手机号，1为邮箱
      pwd: '',
      pwd2: '',
      inviteCode: ''
    };
  },
  mounted() {
    this.inviteCode = this.$route.query.inviteCode || ''
  },
  destroyed() {
    clearInterval(timer1);
    clearInterval(timer2);
  },
  methods: {
    ...mapActions(['register', 'sendSMS']),
    beforeGetCode(type) {
      if (type === 0) {
        if (!reg.phone.test(this.phone)) {
          this.$toast(this.$t('notice.phone'));
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
      } else {
        if (!reg.email.test(this.email)) {
          this.$toast(this.$t('notice.email'));
          return false;
        }
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
      const { country } = this.$store.state;
      let number, countryCode = '';
      if (type === 0) {
        number = this.phone;
        countryCode = country
      } else if (type === 1) {
        number = this.email;
        countryCode = ''
      }
      const data = {countryCode, number};
      this.sendSMS(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
      }).catch(() => {
        this.$toast(this.$t('global.wait'))
      })
    },
    validate () {
      if (this.type === 0 && !reg.phone.test(this.phone)) {
        this.$toast(this.$t('notice.phone'));
        return false;
      } else if (this.type === 1 && !reg.email.test(this.email)) {
        this.$toast(this.$t('notice.email'));
        return false;
      }
      if (this.type === 0 && this.phoneCode.length < 1) {
        this.$toast(this.$t('notice.mobileCode'));
        return false;
      } else if (this.type === 1 && this.emailCode.length < 1) {
        this.$toast(this.$t('notice.emailCode'));
        return false;
      }
      if (!reg.registerNewPassword.test(this.pwd)) {
        this.$toast(this.$t('notice.registerNewPwd'));
        return false;
      }
      if (this.pwd !== this.pwd2) {
        this.$toast(this.$t('notice.confirmPwd'));
        return false;
      }
      if (this.inviteCode.length < 1) {
        this.$toast(this.$t('notice.inviteCode'));
        return false;
      }
    },
    back () {
      this.$router.go(-1)
    },
    change () {
      this.type = this.type === 0 ? 1 : 0
      this.phone = '';
      this.email = '';
      this.phoneCode = '';
      this.emailCode = '';
      this.pwd = '';
      this.pwd2 = '';
      clearInterval(timer1);
      clearInterval(timer2);
    },
    confirm () {
      if (this.validate() === false) return;
      const { country } = this.$store.state
      let data = {
        countryCode: this.type === 0 ? country : '',
        inviteCode: this.inviteCode,
        number: this.type === 0 ? this.phone : this.email,
        password: md5(this.pwd),
        verificationCode: this.type === 0 ? this.phoneCode : this.emailCode
      };
      this.register(data).then((obj) => {
        setCookie('token', encryptByDES(`${obj.userId}${encryptStr}`));
        setCookie('userInfo', JSON.stringify(obj));
        this.$router.push('/index')
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'))
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
  .download{
    margin-top: 30px;
    background-color: #24324C;
    font-size: 14px;
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
      flex: 1;
      color: #000000;
    }
    .send{
      color: #007AFF;
      font-size: 14px;
    }
  }
  .change{
    width: 330px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    color: #24324C;
    font-size: 12px;
    .login{
      text-decoration: none;
      color: #24324C;
    }
  }
</style>
