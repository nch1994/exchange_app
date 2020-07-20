<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="confirm">
      <p class="title">{{ $t('asset.withdrawSuccess.title') }}</p>
      <span />
    </div>
    <div class="info">
      <img src="@/static/img/asset/apply.png" alt="">
      <p class="info_top">{{ $t('asset.withdrawSuccess.notice') }}</p>
      <p class="info_bottom">{{ $t('asset.withdrawSuccess.notice2') }}</p>
    </div>
    <button class="btn" @click="confirm">{{ $t('global.confirm') }}</button>
  </div>
</template>
<script>
export default {
  name: 'WithdrawSuccess',
  methods: {
    confirm() {
      this.$router.go(-3);
    }
  }
}
</script>
<style lang="scss" scoped>
  .info{
    width: 340px;
    height: auto;
    background-color: #ffffff;
    border-radius: 2px;
    padding-top: 43px;
    padding-bottom: 43px;
    margin: 0 auto;
    text-align: center;
    img{
      width: 86px;
      height: 85px;
      margin-bottom: 21px;
    }
    p{
      font-size: 12px;
      font-family: 'Medium';
      line-height: 24px;
      &.info_top {
        color: #24324C;
      }
      &.info_bottom {
        color: #9099A7;
      }
    }
  }
  .btn{
    margin-top: 27px;
  }
</style>
