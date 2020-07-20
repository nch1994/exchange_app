<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">谷歌绑定</p>
      <span />
    </div>
    <div class="items">
      <p>秘钥</p>
      <div class="item">
        <input :value="key" readonly type="text">
        <img src="@/static/img/copy.png" class="copy" @click="copy" data-clipboard-action="copy" :data-clipboard-text="key" alt="">
      </div>
      <div class="item">
        <input v-model="code" type="number" placeholder="请输入谷歌验证码">
      </div>
    </div>
    <div class="oprate">
      <p class="title">操作步骤</p>
      <p class="item1">1·请在APP Store中搜索“Authenticator”并下载；</p>
      <p class="item1">2·请打开谷歌浏览器APP Authenticator，点击右上角“+”选择“手动输入验证码”；</p>
      <p class="item1">3·输入bitget账号或其他自定义名称，并粘贴上面的秘钥“WEIORWIOHSDCFAS”；</p>
      <p class="item1">4·点击右上角“”进行保存；</p>
      <p class="item1">5.请打开谷歌验证器APP Authenticator, 点击右上角“+”，选择提交绑定；</p>
    </div>
    <button type="button" class="btn" @click="binding">提交绑定</button>
  </div>
</template>
<script>
export default {
  name: 'Google',
  data () {
    return {
      key: 'WEIORWIOHSDCFAS',
      code: ''
    }
  },
  methods: {
    validate () {
      if (this.code.length < 1) {
        this.$toast('请输入验证码')
        return false
      }
    },
    copy () {
      let _this = this;
      let clipboard = new this.clipboard(".copy");
      clipboard.on('success', function () {
        _this.$toast("复制成功")
      });
      clipboard.on('error', function () {
        _this.$toast("复制失败")
      });
    },
    back () {
      this.$router.go(-1)
    },
    binding () {
      if (this.validate() === false) return
    }
  }
}
</script>
<style lang="less" scoped>
  .items {
    width: 340px;
    margin: 14px auto 10px;
    background-color: #ffffff;
    p{
      text-align: left;
      padding-top: 5px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #24324C;
    }
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
      width: 260px;
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
  .oprate{
    .title{
      line-height: 24px;
      height: 24px;
      font-size: 12px;
      text-align: left;
      padding-left: 23px;
    }
    .item1{
      text-align: left;
      padding-left: 23px;
      color: #9099A7;
      font-size: 12px;
      line-height: 30px;
      padding-right: 17px;
    }
  }
</style>
