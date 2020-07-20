<template>
  <div class="">
    <img src="@/static/img/logo.png" class="logo" alt="">
    <img src="@/static/img/close.png" alt="" class="back" @click="back">
    <div class="item">
      <input v-model="user" type="text" :placeholder="$t('input.user')">
      <img src="@/static/img/close.png" alt="" class="close" @click="clear">
    </div>
    <div class="item">
      <input v-model="pwd" type="password" :placeholder="$t('input.password')">
      <router-link to="forget" class="forget">{{ $t('input.forget') }}</router-link>
    </div>
    <button type="button" class="btn" @click="submit">{{ $t('global.login') }}</button>
    <router-link to="register" class="register">{{ $t('global.register') }}</router-link>
  </div>
</template>
<script type="es6">
import reg from '@/utils/reg';
import {mapActions} from 'vuex';
import md5 from 'md5';
import { setCookie, encryptByDES, encryptStr } from '@/utils/utils';
export default {
  name: 'Login',
  components: { },
  data() {
    return {
      user: '',
      pwd: ''
    };
  },
  methods: {
    ...mapActions([
      'login'
    ]),
    validate () {
      if (this.user.length < 1) {
        this.$toast(this.$t('notice.user'));
        return false
      }
      if (this.pwd.length<1) {
        this.$toast(this.$t('notice.pwdEmpty'));
        return false;
      }
    },
    back() {
      this.$router.go(-1);
    },
    clear () {
      this.user = ''
    },
    submit () {
      if (this.validate() === false) return;
      const country = this.$store.state.country;
      const number = this.user;
      const password = md5(this.pwd);
      const countryCode = reg.email.test(number) ? '' : country;
      const data = { number, password, countryCode };
      this.login(data).then((obj) => {
        if (obj.mobileAuth === 1 || obj.emailAuth === 1) {
          this.$router.push('/verify')
        } else {
          setCookie('token', encryptByDES(`${obj.userId}${encryptStr}`));
          setCookie('userInfo', JSON.stringify(obj));
          this.$router.push('/index')
        }
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'))
      });
    }
  }
};
</script>

<style lang="less" scoped>
  .logo{
    width: 163px;
    height: auto;
    display: block;
    margin: 90px auto 32px;
  }
  .back{
    width: 24px;
    height: 24px;
    position: fixed;
    top: 20px;
    right: 20px;
  }
  div.item {
    width: 330px;
    height: 64px;
    border-bottom: solid 1px #F0F0F0;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    input{
      width: 220px;
      margin-top: 31px;
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
    .forget{
      padding-left: 14px;
      color: #666666;
      text-align: right;
      text-decoration: none;
      border-left: solid 1px #CCCCCC;
      height: 12px;
      font-size: 12px;
    }
  }
  .register{
    display: block;
    text-align: center;
    color: #24324C;
    font-size: 16px;
    text-decoration: none;
  }
</style>
