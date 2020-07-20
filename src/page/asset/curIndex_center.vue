
<template>
  <div>
    <div class="bg" :style="bgStyle">
      <div class="bg_left">
        <p>{{ $t('asset.fund.title') }}(BTC)</p>
        <p v-text="isShow ? contractBTC : '****'" />
        <p v-text="isShow ? '≈' + contractCNY +'CNY' : '****'" />
      </div>
      <div class="bg_right">
        <img v-if="isShow" src="@/static/img/asset/eye2.png" @click="isShow = !isShow" alt="">
        <img v-else src="@/static/img/asset/eye.png" @click="isShow = !isShow" alt="">
      </div>
      <router-link to="/asset/chooseCont/2" class="bg_bottom">
        <img src="@/static/img/asset/nav04.png" alt="">
        <span>{{ $t('asset.fund.transfer') }}</span>
      </router-link>
    </div>
    <div class="lists">
      <ul class="list" @click="toDetails(item.contName)" v-for="(item, index) in contractAccounts" :key="index">
        <li class="list_top">
          <span>{{ item.contName }}{{ $t('global.perpetual') }}</span>
          <img src="@/static/img/right.png" alt="">
        </li>
        <li>
          <p>{{ $t('asset.fund.rights') }}</p>
          <p>{{ $t('asset.details.unrealized') }}</p>
          <p>{{ $t('asset.fund.rate') }}</p>
        </li>
        <li>
          <p>{{ item.balance || 0 }}</p>
          <p>{{ item.profit || 0 }}</p>
          <p>{{ item.bondRate || 0 }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ['contractAccounts', 'totalRights', 'contractBTC', 'contractCNY'],
  data () {
    return {
      isShow: true,
      bgStyle: {
        backgroundImage: "url("+require('@/static/img/asset/bg.jpg')+")"
      },
    }
  },
  computed: {
  },
  methods: {
    toDetails(contName) {
      this.$router.push({
        query: {
          contName,
        },
        path: '/asset/details'
      })
    }
  }
}
</script>
<style lang="less" scoped>
.bg{
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 340px;
  height: 150px;
  border-radius: 2px;
  background-color: #007AFF;
  margin: 10px auto 10px;
  font-family: 'Medium';
  background-size: 340px 150px;
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
  li{
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
.lists{
  width: 375px;
  border-radius: 2px;
  background-color: #ffffff;
  font-family: 'Medium';
}
.list{
  height: 80px;
  border-bottom: solid 1px #f1f1f1;
  background-color: #ffffff;
  padding-left: 18px;
  padding-right: 15px;
  &:nth-last-child(1) {
    border-bottom: none;
  }
  li{
    align-items: center;
    display: flex;
    &.list_top{
      height: 24px;
    }
    &:nth-child(1){
      padding-top: 11px;
      height: 17px;
      justify-content: space-between;
      margin-bottom: 4px;
      font-family: 'Bold';
      span{
        color: #007AFF;
        font-size: 14px;
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
      width: 117px;
      text-align: left;
    }
    p:nth-child(2){
      width: 97px;
      text-align: left;
    }
    p:nth-child(3){
      width: 97px;
      text-align: right;
    }
  }
}
</style>
