<template>
  <div class="wrap">
    <img src="@/static/img/empty.png" alt="">
    <span>{{ $t('global.notFound') }}</span>
    <router-link to="/" class="btn">{{ $t('global.home') }}</router-link>
  </div>
</template>
<style lang="less" scoped>
  .wrap{
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img{
      width: 150px;
    }
    span{
      line-height: 60px;
      font-size: 14px;
    }
    .btn{
      width: 300px;
      height: 40px;
      line-height: 40px;
      background-color: #007aff;
      border-radius: 4px;
      color: #ffffff;
      font-size: 14px;
      margin: 0;
    }
  }
</style>