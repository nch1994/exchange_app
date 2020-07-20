
<template>
  <div>
    <div class="info">
      <div class="bg" :style="bgStyle">
        <div class="bg_left">
          <p>{{ $t('asset.wallet.title') }}(BTC)</p>
          <p v-text="isShow ? `${totalBTC}` : '****'" />
          <p v-text="isShow ? `≈${totalCNY}CNY` : '****'" />
        </div>
        <div class="bg_right">
          <img v-if="isShow" src="@/static/img/asset/eye2.png" @click="isShow = !isShow" alt="">
          <img v-else src="@/static/img/asset/eye.png" @click="isShow = !isShow" alt="">
        </div>
      </div>
      <ul class="oprate">
        <li v-for="(item, index) in navList" :key="index">
          <router-link :to="item.url" class="routes">
            <img :src="(item.icon)" alt="">
            <span>{{item.text}}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="lists">
      <ul class="list" v-for="(item, index) in accountDetails" :key="index" @click="toFundsDetails(item.enName, item.cny, item.amount, item.icon)">
        <li>{{ item.enName }}<img src="@/static/img/right.png"></li>
        <li>
          <p>{{ $t('asset.wallet.available') }}</p>
          <p>{{ $t('asset.wallet.freeze') }}</p>
          <p>{{ $t('asset.wallet.convert') }}(CNY)</p>
        </li>
        <li>
          <p>{{ item.amount }}</p>
          <p>{{ item.freezeAmount || 0 }}</p>
          <p>{{ item.cny }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  props: ['accountDetails', 'totalBTC', 'totalCNY'],
  data () {
    return {
      isShow: true,
      bgStyle: {
        backgroundImage: "url("+require('@/static/img/asset/bg.jpg')+")"
      },
      navList: [
        {
          text: this.$t('asset.charge.title'),
          icon: require('@/static/img/asset/nav01.png'),
          url: '/asset/chooseCoin/1'
        }, {
          text: this.$t('asset.withdraw.title'),
          icon: require('@/static/img/asset/nav02.png'),
          url: '/asset/chooseCoin/2'
        }, {
          text: this.$t('asset.transfer.title'),
          icon: require('@/static/img/asset/nav03.png'),
          url: '/asset/chooseCoin/3'
        }
      ]
    }
  },
  methods: {
    toFundsDetails(enName, cny, balance, icon) {
      const coinInfo = {
        enName,
        cny,
        balance,
        icon
      }
      localStorage.setItem('coinInfo', JSON.stringify(coinInfo))
      this.$router.push({
        path: `/asset/funds/${enName}`
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .info{
  position: relative;
  height: 175px;
  margin-bottom: 12px;
}
.bg{
  display: flex;
  justify-content: space-between;
  width: 340px;
  height: 150px;
  border-radius: 2px;
  background-color: #007AFF;
  margin: 10px auto;
  font-family: 'Medium';
  background-size: 340px 150px;
  position: relative;
  .bg_left{
    padding-left: 20px;
    text-align: left;
    p{
      color: #ffffff;
      &:nth-child(1) {
        margin-top: 24px;
        font-size: 16px;
        line-height: 22px;
        height: 22px;
        margin-bottom: 3px;
        font-family: 'Semibold';
      }
      &:nth-child(2) {
        font-size: 24px;
        height: 35px;
        line-height: 35px;
        margin-bottom: 7px;
      }
      &:nth-child(3) {
        font-size: 14px;
        height: 17px;
        line-height: 17px;
        font-family: 'Bold';
      }
    }
  }
  .bg_right{
    img{
      width: 24px;
      height: 24px;
      margin-right: 18px;
      margin-top: 18px;
    }
  }
  .bg_bottom{
    position: absolute;
    bottom: 10px;
    right: 12px;
    height: 24px;
    display: flex;
    align-items: center;
    color: #ffffff;
    font-size: 12px;
    font-family: 'Medium';
    img{
      width: 24px;
      height: 24px;
      margin-right: 3px;
    }

  }
}
.oprate{
  font-family: 'Medium';
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  position: absolute;
  bottom: 0;
  width: 284px;
  height: 50px;
  left: 26px;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  li{
    .routes{
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #24324C;
      img{
        width: 32px;
        height: 24px;
        margin-right: 10px;
      }
    }
  }
}
.list{
  width: 375px;
  height: 80px;
  font-family: 'Medium';
  margin: 0 auto;
  border-bottom: solid 1px #f1f1f1;
  background-color: #ffffff;
  li{
    width: 340px;
    margin: 0 auto;
    align-items: center;
    display: flex;
    &:nth-child(1){
      padding-top: 11px;
      height: 24px;
      justify-content: space-between;
      margin-bottom: 4px;
      font-family: 'Bold';
      font-size: 14px;
      span{
        color: #007AFF;
      }
      img{
        width: 11px;
        height: 11px;
      }
    }
    &:nth-child(2){
      margin-bottom: 4px;
      color: #A7AFBC;
      font-size: 12px;
    }
    &:nth-child(3){
      color: #24324C;
      font-size: 12px;
      font-family: Bold;
    }
    p:nth-child(1){
      width: 127px;
      text-align: left;
    }
    p:nth-child(2){
      width: 107px;
      text-align: left;
    }
    p:nth-child(3){
      width: 107px;
      text-align: right;
    }
  }
}
</style>
