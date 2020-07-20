<template>
  <div class="">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('mine.safe.emailBind') }}</p>
      <span />
    </div>
    <div class="item">
      <input v-model="number" type="text" :placeholder="$t('input.email')">
      <button :disabled="disabled1" class="send" @click="getCode()">{{ codeNotice1 }}</button>
    </div>
    <div class="item">
      <input v-model="code" type="number" :placeholder="$t('input.code')">
    </div>
    <button type="button" class="btn" @click="binding">{{ $t('global.confirm') }}</button>
  </div>
</template>
<script>
let timer1 = null;
import reg from '@/utils/reg';
import { mapActions } from 'vuex';
import { getCookie, setCookie, decryptByDES } from '@/utils/utils';
export default {
  name: 'Binding',
  data () {
    return {
      number: '',
      code: '',
      codeNotice1: '',
      disabled1: false
    }
  },
  mounted() {
    this.codeNotice1 = this.$t('input.getCode');
  },
  methods: {
    ...mapActions(['bindingNumber', 'sendSMS']),
    validate () {
      if (!reg.email.test(this.number)) {
        this.$toast(this.$t('notice.email'));
        return false;
      }
      if (this.code.length < 1) {
        this.$toast(this.$t('notice.code'));
        return false;
      }
    },
    back () {
      this.$router.go(-1)
    },
    beforeGetCode() {
      if (!reg.email.test(this.number)) {
        this.$toast(this.$t('notice.email'))
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
      const countryCode = reg.phone.test(this.number) ? country : '';
      const number = this.number;
      const data = {countryCode, number};
      this.sendSMS(data).then(() => {
        this.$toast(this.$t('global.actionSuccess'));
      }).catch(() => {
        this.$toast(this.$t('global.wait'))
      })
    },
    binding () {
      if (this.validate() === false) return
      const { country } = this.$store.state;
      const data = {
        countryCode: reg.phone.test(this.number) ? country : '',
        number: this.number,
        userId: decryptByDES(getCookie('token')),
        verificationCode: this.code
      }
      this.bindingNumber(data).then(() => {
        let userInfo = JSON.parse(getCookie('userInfo'));
        userInfo.email = this.number;
        setCookie('userInfo', JSON.stringify(userInfo));
        this.$router.go(-1)
        this.$toast(this.$t('global.actionSuccess'));
      }).catch((msg) => {
        this.$toast(msg || this.$t('global.wait'))
      })
    }
  }
}
</script>
<style lang="less" scoped>
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
