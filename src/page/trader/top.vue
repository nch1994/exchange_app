<template>
  <div class="tops">
    <img v-if="userInfo.icon" :src="userInfo.icon" alt="">
    <img v-else src="@/static/img/default.png" alt="">
    <div class="right">
      <p class="info"><span class="name">{{ userInfo.nickName || 'STARQUEEN 用户'+ userInfo.userId }}</span></p>
      <p class="intro">{{ userInfo.introduce || $t('homepage.noIntro') }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ['userInfo'],
  data() {
    return {
    }
  },
  watch: {
    userInfo: function(newVal) {
      this.userInfo = newVal
    }
  },
}
</script>
<style lang="less" scoped>
  .tops{
    width: 340px;
    display: flex;
    margin: 0 auto;
    justify-content: space-between;
    img{
      width: 55px;
      height: 55px;
      vertical-align: middle;
      border-radius: 50%;
    }
    .right{
      width: 275px;
      padding-bottom: 20px;
      border-bottom: solid 1px #F1F1F1;
      .info{
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        color: #24324C;
        padding-bottom: 10px;
      }
      .intro{
        font-size: 14px;
        color: #9099A7;
        word-break: break-all;
      }
    }
  }
</style>
