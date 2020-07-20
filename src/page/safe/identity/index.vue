<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">{{ $t('mine.safe.authentication') }}</p>
      <span />
    </div>
    <div class="items-wrap">
      <div class="items">
        <p>{{ $t('mine.safe.idType') }}</p>
        <div class="item">
          <input :value="$t('mine.safe.idCard')" readonly type="text">
        </div>
      </div>
      <div class="items">
        <p>{{ $t('input.realName') }}</p>
        <div class="item">
          <input v-if="userInfo.realName" type="text" :value="userInfo.realName" readonly>
          <input v-else v-model="realName" type="text" :placeholder="$t('input.realName')">
        </div>
      </div>
      <div class="items">
        <p>{{ $t('input.IDNumber') }}</p>
        <div class="item item2">
          <input v-if="userInfo.idNumber" type="text" :value="userInfo.idNumber" readonly>
          <input v-else v-model="card" type="text" :placeholder="$t('input.IDNumber')">
        </div>
      </div>
    </div>
    <button type="button" class="btn" :disabled="userInfo.realName" @click="confirm">{{ $t('global.next') }}</button>
  </div>
</template>
<script>
import reg from '@/utils/reg';
import { getCookie } from '@/utils/utils';
export default {
  name: 'Identity',
  data () {
    return {
      country: '',
      realName: '',
      card: '',
      userInfo: {}
    }
  },
  mounted () {
    this.country = this.$t('mine.safe.ChineseMainland');
    this.userInfo = JSON.parse(getCookie('userInfo'))
  },
  methods: {
    validate () {
      if (this.realName.length < 1) {
        this.$toast(this.$t('notice.realName'));
        return false
      }
      const lang = localStorage.getItem('lang') || 'zh';
      if (!reg.idCard.test(this.card) && lang === 'zh' || !reg.passport.test(this.card) && lang === 'en') {
        this.$toast(this.$t('notice.IDNumber'))
        return false
      }
    },
    back () {
      this.$router.go(-1)
    },
    confirm () {
      if (this.validate() === false) return
      localStorage.setItem('realName', this.realName);
      localStorage.setItem('idNumber', this.card);
      this.$router.push({
        path: 'identity/photo'
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
      padding-top: 5px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #24324C;
      padding-left: 16px;
    }
    
  }
  div.item {
    width: 310px;
    height: 36px;
    border-bottom: solid 1px #F0F0F0;
    margin-left: 17px;
    margin-right: 17px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    input{
      width: 260px;
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
  }
  .item2{
    border-bottom: none !important;
  }
  button[disabled] {
    opacity: 0.6;
  }
</style>
