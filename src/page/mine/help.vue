<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">帮助中心</p>
      <span />
    </div>
    <div class="info">
      <div class="">
        <img src="@/static/img/help01.png" alt="">
        <p>认证问题</p>
      </div>
      <ul>
        <li>如何进行身份认证？</li>
        <li>认证之后是否可以修改用户？认证之后是否可以修改用户？认证之后是否可以修改用户？认证之后是否可以修改用户？</li>
      </ul>
    </div>
    <div class="info">
      <div class="">
        <img src="@/static/img/help02.png" alt="">
        <p>资产问题</p>
      </div>
      <ul>
        <li>如何进行身份认证？</li>
        <li>认证之后是否可以修改用户？认证之后是否可以修改用户？认证之后是否可以修改用户？认证之后是否可以修改用户？</li>
      </ul>
    </div>
    <div class="info">
      <div class="">
        <img src="@/static/img/help03.png" alt="">
        <p>合约问题</p>
      </div>
      <ul>
        <li>如何进行身份认证？</li>
        <li>认证之后是否可以修改用户？认证之后是否可以修改用户？认证之后是否可以修改用户？认证之后是否可以修改用户？</li>
        <li class="notice">查看所有9篇文章</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Help',
  methods: {
    back () {
      this.$router.go(-1)
    },
  }
}
</script>
<style lang="less" scoped>
  .info{
    width: 340px;
    margin: 0 auto 10px;
    background-color: #ffffff;
    border-radius: 2px;
    div{
      height: 30px;
      display: flex;
      align-items: center;
      padding-top: 12px;
      padding-bottom: 5px;
      img{
        margin-left: 19px;
        width: 16px;
        height: 16px;
        margin-right: 6px;
      }
      p{
        font-size: 14px;
        color: #24324C;
        font-family: 'Medium';
      }
    }
    ul{
      padding-bottom: 13px;
      li{
        text-align: left;
        padding-left: 40px;
        padding-right: 20px;
        font-size: 12px;
        color: #9099A7;
        font-family: 'Regular';
        line-height: 30px;
        &.notice{
          color: #007AFF;
        }
      }
    }
  }
</style>
