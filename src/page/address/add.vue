<template>
  <div class="content">
    <div class="tabbar">
      <img src="@/static/img/back.png" alt="" class="back" @click="back">
      <p class="title">新增{{name}}地址</p>
      <span />
    </div>
    <div class="items-wrap">
      <div class="items">
        <p>请输入提币地址</p>
        <div class="item">
          <input v-model="address" type="text" placeholder="请输入提币地址">
          <img src="@/static/img/scan.png" alt="">
        </div>
      </div>
      <div class="items">
        <p>请输入地址备注</p>
        <div class="item item2">
          <input v-model="remark" type="text" placeholder="请输入地址备注">
        </div>
      </div>
    </div>
    <!-- <div class="item">
      <input v-model="address" type="number" placeholder="请输入提币地址" >
      <img src="@/static/img/scan.png" alt="">
    </div>
    <div class="item">
      <input v-model="remark" type="number" placeholder="请输入地址备注" >
    </div> -->
    <button class="btn" @click="confirm">提交</button>
  </div>
</template>
<script>
export default {
  name: 'Address',
  data () {
    return {
      name: '',
      address: '',
      remark: ''
    }
  },
  mounted () {
    this.name = this.$route.query.name
  },
  methods: {
    validate () {
      if (this.address.length < 1) {
        this.$toast('请输入提币地址');
        return false
      }
    },
    back () {
      this.$router.go(-1)
    },
    confirm () {
      if (this.validate() === false) return
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
      padding-top: 15px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      color: #24324C;
      padding-left: 16px;
    }
  }
  div.item {
    width: 310px;
    height: 30px;
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
</style>
